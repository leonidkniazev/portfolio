import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./Table.module.css";

type TagType = "H2" | "H3";

type Content = {
  title: string;
  number: number;
  topOffset: number;
  href: string;
  type: TagType;
};

export default function Table() {
  const [currentItem, setCurrentItem] = createSignal(0);
  const [isOpen, setIsOpen] = createSignal(true);
  const headings = getHeadings();
  let content = generateContent();

  function generateContent() {
    let result: Content[] = [];
    let number = 0;
    for (const heading of headings) {
      let id = heading.getAttribute("id");
      let content = heading.innerText;
      let tagname = heading.tagName as TagType;
      let offsetFromTop =
        heading.getBoundingClientRect().top +
        window.scrollY -
        // 30% of screen
        (window.innerHeight / 100) * 30;

      if (tagname != "H2" && tagname != "H3") {
        continue;
      }
      if (id && content) {
        result.push({
          href: `#${id}`,
          topOffset: offsetFromTop,
          title: content,
          type: tagname,
          number: tagname === "H2" ? ++number : number,
        });
      }
    }
    return result;
  }

  function getHeadings() {
    return document.querySelectorAll<HTMLHeadingElement>(".heading");
  }

  function onScroll() {
    if (!isOpen()) return;
    const currentScroll = window.scrollY;
    let rightItemNumber = 1;
    content.forEach((item) => {
      if (item.topOffset < currentScroll) {
        rightItemNumber = item.number;
        return;
      }
    });
    setCurrentItem(rightItemNumber);
  }

  function onResize() {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    } else {
      content = generateContent();
      setIsOpen(true);
    }
  }

  onMount(() => {
    onScroll();
    onResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll);
  });
  onCleanup(() => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("scroll", onScroll);
  });

  return (
    <>
      {isOpen() && (
        <div class={styles.container}>
          <ol class={styles.list}>
            {content.map((item) => {
              return (
                <li
                  class={`${item.type == "H2" ? styles.large : styles.small} ${
                    item.number == currentItem() && item.type != "H3"
                      ? styles.active
                      : ""
                  }`}
                >
                  <a
                    class={`${styles.link} ${
                      item.type == "H3" && styles.subtitle
                    }`}
                    href={item.href}
                  >
                    {item.type == "H2" ? (
                      <span>{item.number}. </span>
                    ) : (
                      <span>- </span>
                    )}
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </>
  );
}
