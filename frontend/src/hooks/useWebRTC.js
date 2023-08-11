import { useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  // This will stay same comment should remove later
  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  // New use effect to put all the use effect comment should remove later
  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();
      await captureMedia();
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
        handleSetMute(isMute, userId);
      });
      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        handleSetMute(true, userId);
      });
      socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
        handleSetMute(false, userId);
      });
      socket.current.emit(ACTIONS.JOIN, { roomId, user });

      async function captureMedia() {
        // Start capturing local audio stream.
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      async function handleNewPeer({ peerId, createOffer, user: remoteUser }) {
        // If already connected then give warning
        if (peerId in connections.current) {
          return console.warn(
            `You are already connected with ${peerId} (${user.name})`
          );
        }

        // Store it to connection
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        // Handle new ice candidate on this peer connection
        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        };

        // Handle on track event on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            // get current users mute info
            const currentUser = clientsRef.current.find(
              (client) => client.id === user._id
            );
            if (currentUser) {
              socket.current.emit(ACTIONS.MUTE_INFO, {
                userId: user._id,
                roomId,
                isMute: currentUser.muted,
              });
            }

            if (audioElements.current[remoteUser.id]) {
              audioElements.current[remoteUser.id].srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream;
                  settled = true;
                }
                if (settled) {
                  clearInterval(interval);
                }
              }, 300);
            }
          });
        };

        // Add local track to remote connections
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });

        // Create an offer if required
        if (createOffer) {
          const offer = await connections.current[peerId].createOffer();
          await connections.current[peerId].setLocalDescription(offer);

          // Send offer to another client
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      }

      async function handleRemovePeer({ peerId, userId }) {
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }
        delete connections.current[peerId];
        delete audioElements.current[peerId];

        setClients((list) => list.filter((client) => client._id !== userId));
      }

      async function handleIceCandidate({ peerId, icecandidate }) {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      }

      async function handleRemoteSdp({
        peerId,
        sessionDescription: remoteSessionDescription,
      }) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );

        // if session description is type of offer then create an answer
        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId];
          const answer = await connection.createAnswer();

          connection.setLocalDescription(answer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }

      async function handleSetMute(mute, userId) {
        const clientIdx = clientsRef.current
          .map((client) => client._id)
          .indexOf(userId);

        const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
        if (clientIdx > -1) {
          connectedClients[clientIdx].muted = mute;
          setClients(connectedClients);
        }
      }
    };

    initChat();

    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections.current[peerId];
        delete audioElements.current[peerId];
      }
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UN_MUTE);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  //  Handling Mute
  const handleMute = (isMute, userId) => {
    let settled = false;

    if (userId === user._id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId,
            });
          } else {
            socket.current.emit(ACTIONS.UN_MUTE, {
              roomId,
              userId,
            });
          }
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  return { clients, provideRef, handleMute };
};
