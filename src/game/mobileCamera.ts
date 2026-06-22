import Phaser from "phaser";
import { getViewportMode, VIEWPORT_MODE_EVENT } from "./mobileViewport";

const OFFICE_WORLD = {
  width: 1380,
  height: 780,
  centerX: 690,
  centerY: 390,
};

export type MobileCameraController = {
  focusNow: () => void;
  destroy: () => void;
};

type Target = Phaser.GameObjects.Components.Transform | null | undefined;

export function attachOfficeMobileCamera(
  scene: Phaser.Scene,
  getTarget: () => Target,
): MobileCameraController {
  const camera = scene.cameras.main;

  const apply = () => {
    camera.setBounds(0, 0, OFFICE_WORLD.width, OFFICE_WORLD.height);

    if (getViewportMode() !== "mobile-landscape") {
      camera.stopFollow();
      camera.setZoom(1);
      camera.setScroll(0, 0);
      return;
    }

    const viewportWidth = Math.max(1, camera.width);
    const viewportHeight = Math.max(1, camera.height);
    const zoom = Phaser.Math.Clamp(
      Math.max(viewportWidth / 1220, viewportHeight / 640),
      0.64,
      0.78,
    );
    const target = getTarget();

    camera.setZoom(zoom);

    if (target) {
      camera.startFollow(target, true, 0.14, 0.14);
      camera.centerOn(target.x, target.y);
    } else {
      camera.centerOn(OFFICE_WORLD.centerX, OFFICE_WORLD.centerY);
    }
  };

  const focusNow = () => scene.time.delayedCall(0, apply);
  const onViewportChange = () => focusNow();

  scene.scale.on(Phaser.Scale.Events.RESIZE, focusNow);
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("orientationchange", onViewportChange, { passive: true });
  window.addEventListener(VIEWPORT_MODE_EVENT, onViewportChange);

  focusNow();

  return {
    focusNow,
    destroy: () => {
      scene.scale.off(Phaser.Scale.Events.RESIZE, focusNow);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      window.removeEventListener(VIEWPORT_MODE_EVENT, onViewportChange);
      camera.stopFollow();
    },
  };
}

const ROOM_WORLD = {
  width: 1380,
  height: 780,
  centerX: 690,
  centerY: 390,
};

export function attachPlayableRoomMobileCamera(
  scene: Phaser.Scene,
  getTarget: () => Target,
): MobileCameraController {
  const camera = scene.cameras.main;

  const apply = () => {
    camera.setBounds(0, 0, ROOM_WORLD.width, ROOM_WORLD.height);

    if (getViewportMode() !== "mobile-landscape") {
      camera.stopFollow();
      camera.setZoom(1);
      camera.setScroll(0, 0);
      return;
    }

    const viewportWidth = Math.max(1, camera.width);
    const viewportHeight = Math.max(1, camera.height);
    const zoom = Phaser.Math.Clamp(
      Math.max(viewportWidth / 1220, viewportHeight / 620),
      0.68,
      0.82,
    );
    const target = getTarget();

    camera.setZoom(zoom);
    if (target) {
      camera.startFollow(target, true, 0.16, 0.16);
      camera.centerOn(target.x, target.y);
    } else {
      camera.centerOn(ROOM_WORLD.centerX, ROOM_WORLD.centerY);
    }
  };

  const focusNow = () => scene.time.delayedCall(0, apply);
  const onViewportChange = () => focusNow();

  scene.scale.on(Phaser.Scale.Events.RESIZE, focusNow);
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("orientationchange", onViewportChange, { passive: true });
  window.addEventListener(VIEWPORT_MODE_EVENT, onViewportChange);

  focusNow();

  return {
    focusNow,
    destroy: () => {
      scene.scale.off(Phaser.Scale.Events.RESIZE, focusNow);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      window.removeEventListener(VIEWPORT_MODE_EVENT, onViewportChange);
      camera.stopFollow();
    },
  };
}
