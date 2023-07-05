import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./certificatesView.module.css";

const CeritificateView = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  const [imgUrl, setImgUrl] = createSignal<string>();
  const [verificationUrl, setVerificationUrl] = createSignal<string>();
  let certificateButtons: NodeListOf<HTMLButtonElement>;
  let timeout: ReturnType<typeof setTimeout>;

  function handleOpen(e: MouseEvent) {
    if (window.innerWidth <= 768) return;
    e.stopPropagation();
    const host = e.currentTarget as HTMLButtonElement;

    if (isOpen()) {
      setIsClosing(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      const [verification, image] = [
        host.dataset.verification,
        host.dataset.img,
      ];
      setVerificationUrl(verification);
      setImgUrl(image);
      clearTimeout(timeout);
      setIsClosing(false);
      setIsOpen(true);
    }
  }

  function handleResize() {
    if (window.innerWidth >= 768 && isOpen()) {
      setIsClosing(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    }
  }

  onMount(() => {
    certificateButtons =
      document.querySelectorAll<HTMLButtonElement>("button.certificate");
    window.addEventListener("resize", handleResize);
    certificateButtons.forEach((btn) => {
      btn.addEventListener("click", handleOpen);
    });
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    certificateButtons?.forEach((btn) => {
      btn.removeEventListener("click", handleOpen);
    });
    window?.removeEventListener("resize", handleResize);
  });

  return (
    <>
      {isOpen() && (
        <div
          onClick={handleOpen}
          class={`${styles.overlay} ${isClosing() ? styles.closing : ""}`}
        >
          <div class={styles.container} onClick={(e) => e.stopPropagation()}>
            <div class={styles.buttons}>
              <a class={styles.link} href={verificationUrl()} target="_blank">
                <img
                  class={styles.icon}
                  src="/external.svg"
                  alt="certificate icon"
                />
              </a>
              <button class={styles.close} onClick={handleOpen}>
                <img class={styles.icon} src="/close.svg" alt="close icon" />
              </button>
            </div>
            <img class={styles.image} src={imgUrl()} alt={"Certificate"} />
          </div>
        </div>
      )}
    </>
  );
};

export default CeritificateView;
