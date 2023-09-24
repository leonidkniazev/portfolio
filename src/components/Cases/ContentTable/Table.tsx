import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./Table.module.css";

type TagType = "H2" | "H3";

type Chapter = {
  number: number;
  href: string;
  title: string;
  topOffset: number;
  children: SubChapter[];
};

type SubChapter = {
  title: string;
  href: string;
};

export default function Table() {
  const [currentItem, setCurrentItem] = createSignal(1);
  const [isOpen, setIsOpen] = createSignal(true);
  const headings = getHeadings();
  let content = generateContent();

  function generateContent() {
    let result: Chapter[] = [];
    let number = 0;
    for (const heading of headings) {
      let id = heading.getAttribute("id");
      let content = heading.innerText;
      let tagname = heading.tagName as TagType;
      let offsetFromTop =
        heading.getBoundingClientRect().top +
        window.scrollY -
        // 30% of the screen
        (window.innerHeight / 100) * 30;

      if (tagname != "H2" && tagname != "H3") {
        continue;
      }

      if (id && content) {
        if (tagname == "H3" && result[number - 1]) {
          result[number - 1].children.push({
            href: `#${id}`,
            title: content,
          });
        }
        if (tagname == "H2") {
          result.push({
            href: `#${id}`,
            topOffset: offsetFromTop,
            title: content,
            number: ++number,
            children: [],
          });
        }
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
    content.forEach((item) => {
      if (item.topOffset < currentScroll) {
        setCurrentItem(item.number);
        return;
      }
    });
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
            {content.map((chapter) => (
              <>
                <li
                  class={`${styles.large} ${
                    chapter.number == currentItem() ? styles.active : ""
                  }`}
                >
                  <a class={styles.link} href={chapter.href}>
                    <span>{chapter.number}. </span>
                    {chapter.title}
                  </a>
                </li>
                <div
                  class={`${styles.childrenContainer} ${
                    chapter.number == currentItem() ? styles.open : ""
                  }`}
                >
                  <ul>
                    {chapter.children.map((child) => (
                      <li class={styles.small}>
                        <a href={child.href}>
                          <span>{child.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
