/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { clinicStore } from './state/clinicStore';
import { ActiveTab, CameraPreset, ThemeMode } from './types/clinic';
import { ClinicalTwin3D } from './components/canvas3d/ClinicalTwin3D';
import { LiveAvatarOverlay } from './components/canvas3d/LiveAvatarOverlay';
import { TopNav } from './components/ui/TopNav';
import { PeopleAndRoomsPanel } from './components/ui/PeopleAndRoomsPanel';
import { WardOverviewAndControls } from './components/ui/WardOverviewAndControls';
import { EventFeed } from './components/ui/EventFeed';
import { KPIBoard } from './components/ui/KPIBoard';
import { StaffList } from './components/ui/StaffList';
import { AlertPanel } from './components/ui/AlertPanel';
import { WaitingList } from './components/ui/WaitingList';
import { TriageForm } from './components/ui/TriageForm';
import { RoomModal } from './components/ui/RoomModal';
import { CCTVStreamModal } from './components/ui/CCTVStreamModal';
import { GeminiAIModal } from './components/ui/GeminiAIModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clinica');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('andar');
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [cctvRoomId, setCctvRoomId] = useState<number | null>(null);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(clinicStore.getTheme());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setTheme(clinicStore.getTheme());
    });
    return () => unsub();
  }, []);

  const handleSelectRoom = (roomId: number | null) => {
    setSelectedRoomId(roomId);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'recepcao') {
      setActiveView('recepcao');
    } else if (tab === 'rh') {
      setActiveView('rh');
    } else {
      setActiveView('overview');
    }
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none font-sans transition-colors duration-500 ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
    >
      {/* 1. 3D WebGL Canvas Layer (Base Engine) */}
      <ClinicalTwin3D
        selectedRoomId={selectedRoomId}
        onSelectRoom={handleSelectRoom}
        activeView={activeView}
        cameraPreset={cameraPreset}
        onSelectCCTV={(id) => setCctvRoomId(id)}
      />

      {/* 2. Interactive 2D/3D Billboarding Avatars & Room Badges */}
      <LiveAvatarOverlay
        onSelectRoom={(id) => handleSelectRoom(id)}
        selectedRoomId={selectedRoomId}
      />

      {/* 3. Executive Top Navigation Bar (Matching Video) */}
      <TopNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cameraPreset={cameraPreset}
        onCameraPresetChange={setCameraPreset}
        onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
      />

      {/* 4. Glassmorphism Side Panels Overlay Grid */}
      <main className="absolute inset-0 z-20 pointer-events-none pt-20 pb-5 px-6 flex justify-between gap-6">
        {/* Left Side Panel */}
        <section className="w-80 md:w-96 h-full flex flex-col pointer-events-auto transition-all duration-300">
          {activeTab === 'clinica' && (
            <PeopleAndRoomsPanel
              onSelectRoom={(id) => handleSelectRoom(id)}
              onSelectCCTV={(id) => setCctvRoomId(id)}
            />
          )}
          {activeTab === 'societario' && (
            <EventFeed onSelectRoom={(id) => handleSelectRoom(id)} />
          )}
          {activeTab === 'rh' && (
            <StaffList onSelectRoom={(id) => handleSelectRoom(id)} />
          )}
          {activeTab === 'recepcao' && (
            <WaitingList onSelectRoom={(id) => handleSelectRoom(id)} />
          )}
        </section>

        {/* Right Side Panel */}
        <section className="w-80 md:w-96 h-full flex flex-col pointer-events-auto transition-all duration-300">
          {activeTab === 'clinica' && <WardOverviewAndControls />}
          {activeTab === 'societario' && (
            <KPIBoard onSelectRoom={(id) => handleSelectRoom(id)} />
          )}
          {activeTab === 'rh' && <AlertPanel />}
          {activeTab === 'recepcao' && <TriageForm />}
        </section>
      </main>

      {/* 5. Room Drill-Down Modal (/os/sala/:id) */}
      <RoomModal
        roomId={selectedRoomId}
        onClose={() => setSelectedRoomId(null)}
      />

      {/* 6. CCTV Live Telemetry Stream Modal */}
      <CCTVStreamModal
        roomId={cctvRoomId}
        onClose={() => setCctvRoomId(null)}
      />

      {/* 7. Gemini AI Strategic Neural Analysis Modal */}
      <GeminiAIModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
      />
    </div>
  );
}
