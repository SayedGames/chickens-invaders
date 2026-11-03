/**
 * Chickens Invaders - App Root
 * Full-viewport Game Shell orchestrating the 60fps Canvas GameEngine, Loading Sequence, and UI Modals.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine/GameEngine';
import { GameScreen, PlayerStats } from './game/types';
import { SaveManager } from './game/SaveManager';
import { getMissionById, getNextMissionId } from './game/data/missions';
import { TitleScreen } from './components/TitleScreen';
import { HUDOverlay } from './components/HUDOverlay';
import { MobileControls } from './components/MobileControls';
import { MissionSelectModal } from './components/MissionSelectModal';
import { HangarModal } from './components/HangarModal';
import { UpgradesModal } from './components/UpgradesModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { StatsModal } from './components/StatsModal';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { DefeatModal } from './components/DefeatModal';
import { CreditsModal } from './components/CreditsModal';
import { LoadingScreen } from './components/LoadingScreen';
import { sound } from './game/audio/SoundEffects';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const saveMgr = SaveManager.getInstance();
  const [saveData, setSaveData] = useState(saveMgr.getData());

  // 5-second Loading Screen State
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Screen State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('title');
  const [activeMissionId, setActiveMissionId] = useState<string>('w1_m1');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isDefeat, setIsDefeat] = useState<boolean>(false);

  // HUD State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [maxHealth, setMaxHealth] = useState<number>(100);
  const [shield, setShield] = useState<number>(50);
  const [maxShield, setMaxShield] = useState<number>(50);
  const [specialReady, setSpecialReady] = useState<boolean>(true);
  const [specialRatio, setSpecialRatio] = useState<number>(1.0);
  const [specialName, setSpecialName] = useState<string>('Missile Barrage');
  const [wave, setWave] = useState<number>(1);
  const [totalWaves, setTotalWaves] = useState<number>(3);
  const [bossInfo, setBossInfo] = useState<{
    active: boolean;
    name: string;
    health: number;
    maxHealth: number;
    phase: number;
    maxPhases: number;
  } | null>(null);

  // Run Summary State
  const [victoryStars, setVictoryStars] = useState<number>(1);
  const [runStats, setRunStats] = useState<PlayerStats>(saveData.stats);

  // Auto-Fire setting: true by default as requested
  const [autoFire, setAutoFire] = useState<boolean>(true);

  // Initialize GameEngine
  useEffect(() => {
    if (!canvasRef.current) return;

    sound.setVolumes(
      saveData.settings.masterVolume,
      saveData.settings.sfxVolume,
      saveData.settings.musicVolume,
      saveData.settings.muted
    );

    const engine = new GameEngine(canvasRef.current, {
      onScoreUpdate: (newScore, newCombo, newCoins) => {
        setScore(newScore);
        setCombo(newCombo);
        setSessionCoins(newCoins);
      },
      onHealthUpdate: (hp, maxHp, sp, maxSp) => {
        setHealth(hp);
        setMaxHealth(maxHp);
        setShield(sp);
        setMaxShield(maxSp);
      },
      onSpecialUpdate: (ratio, ready) => {
        setSpecialRatio(ratio);
        setSpecialReady(ready);
      },
      onBossHealthUpdate: (name, hp, maxHp, phase, maxPhases) => {
        setBossInfo({
          active: true,
          name,
          health: hp,
          maxHealth: maxHp,
          phase,
          maxPhases,
        });
      },
      onBossDefeated: () => {
        setBossInfo(null);
      },
      onMissionComplete: (stars, finalScore, coinsEarned, stats) => {
        setIsVictory(true);
        setVictoryStars(stars);
        setRunStats(stats);
        const nextId = getNextMissionId(activeMissionId);
        saveMgr.recordMissionComplete(activeMissionId, stars, finalScore, coinsEarned, nextId);
        setSaveData({ ...saveMgr.getData() });
      },
      onMissionFailed: (finalScore, finalCoins, stats) => {
        setIsDefeat(true);
        setRunStats(stats);
      },
      onWaveUpdate: (currentW, totalW) => {
        setWave(currentW);
        setTotalWaves(totalW);
      },
    });

    // Automatically fire independently without pressing buttons
    engine.input.setAutoFire(true);
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  // Update auto-fire on engine
  const handleToggleAutoFire = useCallback(() => {
    const next = !autoFire;
    setAutoFire(next);
    saveData.settings.autoFire = next;
    saveMgr.save({ settings: saveData.settings });
    if (engineRef.current) {
      engineRef.current.input.setAutoFire(next);
    }
  }, [autoFire, saveData, saveMgr]);

  // Launch a specific mission
  const launchMission = useCallback((missionId: string) => {
    setActiveMissionId(missionId);
    setCurrentScreen('gameplay');
    setIsPaused(false);
    setIsVictory(false);
    setIsDefeat(false);
    setBossInfo(null);

    const m = getMissionById(missionId);
    if (m) {
      setTotalWaves(m.waves.length);
    }

    if (engineRef.current) {
      sound.resume();
      engineRef.current.startMission(missionId);
    }
  }, []);

  // Start Campaign from Title (latest unlocked mission)
  const handleStartCampaign = useCallback(() => {
    const unlocked = saveMgr.getData().unlockedMissions;
    const latest = unlocked[unlocked.length - 1] || 'w1_m1';
    launchMission(latest);
  }, [launchMission, saveMgr]);

  // Restart current mission
  const handleRestartMission = useCallback(() => {
    setIsPaused(false);
    setIsVictory(false);
    setIsDefeat(false);
    setBossInfo(null);
    if (engineRef.current) {
      engineRef.current.startMission(activeMissionId);
    }
  }, [activeMissionId]);

  // Revive player
  const handleRevive = useCallback(() => {
    if (engineRef.current && engineRef.current.revivePlayer()) {
      setIsDefeat(false);
      setSaveData({ ...saveMgr.getData() });
    }
  }, [saveMgr]);

  // Next Mission
  const handleNextMission = useCallback(() => {
    const nextId = getNextMissionId(activeMissionId);
    if (nextId) {
      launchMission(nextId);
    } else {
      setCurrentScreen('title');
    }
  }, [activeMissionId, launchMission]);

  // Return to Menu / Galaxy Map
  const handleReturnToMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setIsPaused(false);
    setIsVictory(false);
    setIsDefeat(false);
    setBossInfo(null);
    setSaveData(saveMgr.getData());
    setCurrentScreen('title');
  }, [saveMgr]);

  // Global Key Shortcuts for Title Screen (Enter/Space to start)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentScreen === 'title' && !isLoading) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleStartCampaign();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, isLoading, handleStartCampaign]);

  // Active mission metadata
  const currentMissionDef = getMissionById(activeMissionId);
  const nextMissionId = getNextMissionId(activeMissionId);

  return (
    <main className="relative w-full h-full overflow-hidden bg-slate-950 font-sans">
      {/* 0. 5-Second Mandatory Loading Screen with Glowing 'Made by SAYED NASAR' */}
      {isLoading && (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      )}

      {/* 1. Underlying 60fps HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair z-0"
      />

      {/* 2. Title Screen Overlay */}
      {currentScreen === 'title' && !isLoading && (
        <TitleScreen
          onStartCampaign={handleStartCampaign}
          onContinue={handleStartCampaign}
          onNavigate={(screen) => setCurrentScreen(screen)}
          coins={saveData.coins}
          unlockedMissionsCount={saveData.unlockedMissions.length}
          latestMissionName={
            getMissionById(saveData.unlockedMissions[saveData.unlockedMissions.length - 1] || 'w1_m1')?.name ||
            'Sector 1'
          }
        />
      )}

      {/* 3. Gameplay Active HUD */}
      {currentScreen === 'gameplay' && !isPaused && !isVictory && !isDefeat && !isLoading && (
        <>
          <HUDOverlay
            score={score}
            combo={combo}
            coins={sessionCoins}
            health={health}
            maxHealth={maxHealth}
            shield={shield}
            maxShield={maxShield}
            specialReady={specialReady}
            specialRatio={specialRatio}
            specialName={specialName}
            wave={wave}
            totalWaves={totalWaves}
            bossInfo={bossInfo}
            onPause={() => {
              if (engineRef.current) {
                engineRef.current.pause();
                setIsPaused(true);
              }
            }}
            onSpecial={() => {
              if (engineRef.current) {
                engineRef.current.input.setVirtualButton('special', true);
              }
            }}
          />

          {/* Direct touch controls on canvas */}
          {engineRef.current && (
            <MobileControls
              input={engineRef.current.input}
              autoFire={autoFire}
              onToggleAutoFire={handleToggleAutoFire}
              leftHanded={saveData.settings.leftHanded}
            />
          )}
        </>
      )}

      {/* 4. Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => {
            setIsPaused(false);
            if (engineRef.current) engineRef.current.resume();
          }}
          onRestart={handleRestartMission}
          onQuit={handleReturnToMenu}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {/* 5. Victory Modal */}
      {isVictory && (
        <VictoryModal
          stars={victoryStars}
          score={score}
          coinsEarned={sessionCoins + (currentMissionDef?.completionCoins || 50)}
          stats={runStats}
          missionName={currentMissionDef?.name || 'Sector Cleared'}
          hasNextMission={!!nextMissionId}
          onNextMission={handleNextMission}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {/* 6. Defeat Modal */}
      {isDefeat && (
        <DefeatModal
          score={score}
          coins={sessionCoins}
          stats={runStats}
          onRevive={handleRevive}
          onRetry={handleRestartMission}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {/* 7. Modal Navigation Screens */}
      {currentScreen === 'mission_select' && (
        <MissionSelectModal
          onClose={() => setCurrentScreen('title')}
          onLaunchMission={(mId) => launchMission(mId)}
        />
      )}

      {currentScreen === 'hangar' && (
        <HangarModal
          onClose={() => setCurrentScreen('title')}
          onSelectShip={(sId) => {
            setSaveData(saveMgr.getData());
          }}
        />
      )}

      {currentScreen === 'upgrades' && (
        <UpgradesModal
          onClose={() => {
            setSaveData(saveMgr.getData());
            setCurrentScreen('title');
          }}
        />
      )}

      {currentScreen === 'shop' && (
        <ShopModal
          onClose={() => {
            setSaveData(saveMgr.getData());
            setCurrentScreen('title');
          }}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsModal
          onClose={() => {
            setSaveData(saveMgr.getData());
            if (isPaused) {
              setCurrentScreen('gameplay');
            } else {
              setCurrentScreen('title');
            }
          }}
        />
      )}

      {currentScreen === 'achievements' && (
        <AchievementsModal
          onClose={() => {
            setSaveData(saveMgr.getData());
            setCurrentScreen('title');
          }}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsModal
          onClose={() => setCurrentScreen('title')}
        />
      )}

      {currentScreen === 'credits' && (
        <CreditsModal
          onClose={() => setCurrentScreen('title')}
        />
      )}
    </main>
  );
}
