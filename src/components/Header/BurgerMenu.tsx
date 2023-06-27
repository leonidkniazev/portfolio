import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./burgerMenu.module.css";
import { useTranslations } from "../../i18n/utils";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

const BurgerMenu = (props: {
  language: ArgumentTypes<typeof useTranslations>[0];
  resumeUrl: string;
}) => {
  const t = useTranslations(props.language);
  const [isOpen, setIsOpen] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  let openBtn: HTMLButtonElement;
  let timeout: ReturnType<typeof setTimeout> = null;
  function handleResize() {
    if (window.innerWidth >= 768 && isOpen()) {
      openBtn.classList.remove("active");
      setIsClosing(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    }
  }
  function handleOpen() {
    if (isOpen()) {
      openBtn.classList.remove("active");
      setIsClosing(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      openBtn.classList.add("active");
      clearTimeout(timeout);
      setIsClosing(false);
      setIsOpen(true);
    }
  }
  onMount(() => {
    openBtn = document.getElementById("burgerbtn") as HTMLButtonElement;
    openBtn.addEventListener("click", handleOpen);
    window.addEventListener("resize", handleResize);
  });
  onCleanup(() => {
    if (typeof window === "undefined") return;
    openBtn.removeEventListener("click", handleOpen);
    window.removeEventListener("resize", handleResize);
  });
  return (
    <>
      {isOpen() && (
        <div class={styles.overlay} onClick={handleOpen}>
          <div
            class={`${styles.container} ${isClosing() ? styles.closing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <a href="#" onClick={handleOpen} class={styles.item}>
              {t("nav.aboutme")}
            </a>
            <a href="#projects" onClick={handleOpen} class={styles.item}>
              {t("nav.projects")}
            </a>
            <a href="#skills" onClick={handleOpen} class={styles.item}>
              {t("nav.skills")}
            </a>
            <a href="#contacts" onClick={handleOpen} class={styles.item}>
              {t("nav.contacts")}
            </a>
            <a
              href={props.resumeUrl}
              target="_blank"
              onClick={handleOpen}
              class={styles.item}
            >
              {t("nav.resume")}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
