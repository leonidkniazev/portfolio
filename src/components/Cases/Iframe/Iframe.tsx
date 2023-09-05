import { JSX, createSignal } from "solid-js";
import styles from "./Iframe.module.css";
import { ImageMetadata } from "astro";

type Props = {
  src: string;
  title: string;
  children: JSX.Element;
};

const Iframe = (props: Props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isOpening, setIsOpening] = createSignal(false);
  let timeout: ReturnType<typeof setTimeout>;
  function handleOpen() {
    setIsOpen(true);
  }
  return (
    <div onClick={handleOpen} class={styles.container}>
      {isOpen() ? (
        <iframe
          class={styles.iframe}
          width="2000"
          height="600"
          title={props.title}
          src={props.src}
        ></iframe>
      ) : (
        <>{props.children}</>
      )}
    </div>
  );
};

export default Iframe;
