import React from 'react';
import { useApp } from '../context/AppContext';

export default function CallingOverlay() {
  const {
    activeCall,
    callTimer,
    isMuted,
    isSpeakerOn,
    setIsSpeakerOn,
    isVideoMuted,
    participantsList,
    remoteStreams,
    localStream,
    acceptCall,
    declineCall,
    endCall,
    addParticipant,
    toggleMute,
    toggleVideoMute
  } = useApp();

  if (!activeCall) return null;

  return (
    <div className="fixed inset-0 bg-[#111b21] z-[10005] flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300 select-none">
      {/* Hidden audio outputs for remote participants */}
      {Object.entries(remoteStreams).map(([username, stream]) => (
        <audio
          key={`audio_${username}`}
          autoPlay
          ref={(el) => {
            if (el && el.srcObject !== stream) {
              el.srcObject = stream;
            }
          }}
        />
      ))}

      <div className="flex flex-col items-center space-y-6 text-center w-full">
        {/* Glowing Pulse calling indicators (only if audio call or not connected yet) */}
        {(activeCall.type !== 'video' || activeCall.status !== 'Connected') && (
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-slate-800 shadow-xl border border-slate-700">
            <span className="absolute inset-0 rounded-full bg-[#00a884]/20 animate-ping duration-1000"></span>
            <span className="absolute inset-2 rounded-full bg-[#00a884]/15 animate-ping duration-1500 delay-300"></span>
            {activeCall.avatar ? (
              <img src={activeCall.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[48px] text-[#8696a0]">person</span>
            )}
            {activeCall.type === 'video' && (
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#00a884] border-2 border-[#111b21] flex items-center justify-center">
                <span className="material-symbols-outlined text-[12px]">videocam</span>
              </span>
            )}
          </div>
        )}

        {/* WebRTC Video Grid */}
        {activeCall.type === 'video' && activeCall.status === 'Connected' && (
          <div className="w-full max-w-lg aspect-video bg-black rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
            {/* Remote Video Feeds */}
            {Object.keys(remoteStreams).length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs gap-2 select-none">
                <span className="material-symbols-outlined animate-spin">sync</span>
                Connecting Peer Feeds...
              </div>
            ) : (
              <div className={`w-full h-full grid gap-2 p-2 ${Object.keys(remoteStreams).length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {Object.entries(remoteStreams).map(([username, stream]) => (
                  <div key={username} className="relative bg-slate-900 rounded-2xl overflow-hidden w-full h-full">
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      ref={(el) => {
                        if (el && el.srcObject !== stream) {
                          el.srcObject = stream;
                        }
                      }}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                      @{username}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Local Video Preview (Picture in Picture) */}
            {localStream && !isVideoMuted && (
              <div className="absolute top-4 right-4 w-28 h-40 bg-slate-800 rounded-2xl overflow-hidden border border-white/20 shadow-md">
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (el && el.srcObject !== localStream) {
                      el.srcObject = localStream;
                    }
                  }}
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full select-none">
                  You
                </span>
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold tracking-wide">
            {activeCall.name} {participantsList.length > 2 && `(+${participantsList.length - 2})`}
          </h3>
          <span className="text-sm font-medium uppercase tracking-widest text-[#00a884] mt-2 block animate-pulse">{activeCall.status}</span>
        </div>

        {/* Call Members List */}
        {participantsList.length > 2 && (
          <div className="text-[10px] text-slate-400 font-bold max-w-xs truncate">
            Call members: {participantsList.map(p => `@${p}`).join(', ')}
          </div>
        )}

        {activeCall.status === 'Connected' && (
          <div className="font-mono text-sm bg-white/5 border border-white/10 rounded-full px-4 py-1.5 shadow-inner">
            {Math.floor(callTimer / 60)}:{String(callTimer % 60).padStart(2, '0')}
          </div>
        )}

        {activeCall.isIncoming && activeCall.status === 'Ringing...' && (
          <div className="flex gap-4">
            <button 
              onClick={declineCall}
              className="px-6 py-2.5 bg-error text-white rounded-xl text-xs font-black shadow-md hover:bg-red-650 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">call_end</span> Decline
            </button>
            <button 
              onClick={acceptCall}
              className="px-6 py-2.5 bg-[#00a884] text-white rounded-xl text-xs font-black shadow-md hover:bg-[#008f6f] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">call</span> Accept
            </button>
          </div>
        )}
      </div>

      {/* Add Participant Drawer */}
      {activeCall.status === 'Connected' && (
        <div className="absolute bottom-32 flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              id="add-participant-username"
              placeholder="Enter username to add..."
              className="bg-white/10 text-white text-xs px-3.5 py-2 rounded-xl border border-white/25 outline-none placeholder-white/40 focus:ring-1 focus:ring-[#00a884] w-48 font-bold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target.value.trim();
                  if (target) {
                    addParticipant(target);
                    e.target.value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById('add-participant-username');
                const target = el?.value.trim();
                if (target) {
                  addParticipant(target);
                  el.value = '';
                }
              }}
              className="bg-[#00a884] hover:bg-[#008f72] text-white text-xs font-black px-3.5 py-2 rounded-xl cursor-pointer shadow transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Premium Call Controls Bar */}
      <div className="absolute bottom-12 flex items-center gap-6">
        {/* Mic Toggle button */}
        <button 
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer border ${
            isMuted 
              ? 'bg-[#ea4335] text-white border-transparent hover:bg-red-650' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/25'
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isMuted ? 'mic_off' : 'mic'}
          </span>
        </button>

        {/* End Call Button */}
        <button 
          onClick={endCall} 
          className="w-16 h-16 rounded-full bg-error text-white hover:bg-red-700 flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
          title="End Call"
        >
          <span className="material-symbols-outlined text-[28px]">call_end</span>
        </button>

        {/* Video Toggle button (only for video calls) */}
        {activeCall.type === 'video' ? (
          <button 
            onClick={toggleVideoMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer border ${
              isVideoMuted 
                ? 'bg-[#ea4335] text-white border-transparent hover:bg-red-650' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/25'
            }`}
            title={isVideoMuted ? "Turn Video On" : "Turn Video Off"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isVideoMuted ? 'videocam_off' : 'videocam'}
            </span>
          </button>
        ) : (
          /* Speaker Toggle button for audio calls */
          <button 
            onClick={() => setIsSpeakerOn(prev => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer border ${
              isSpeakerOn 
                ? 'bg-white text-slate-900 border-white hover:bg-white/95' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/25'
            }`}
            title={isSpeakerOn ? "Speaker Off" : "Speaker On"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isSpeakerOn ? 'volume_up' : 'volume_down'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
