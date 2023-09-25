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
  const [content, setContent] = createSignal<
    ReturnType<typeof generateContent>
  >([]);

  function generateContent(headings: ReturnType<typeof getHeadings>) {
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
    const currentScroll = window.scrollY;
    content().forEach((item) => {
      if (item.topOffset < currentScroll) {
        setCurrentItem(item.number);
        return;
      }
    });
  }

  onMount(() => {
    let headings = getHeadings();
    setContent(generateContent(headings));
    onScroll();
    document.addEventListener("scroll", onScroll);
  });
  onCleanup(() => {
    if (typeof window != "undefined")
      document.removeEventListener("scroll", onScroll);
  });

  return (
    <div class={styles.container}>
      <ol class={styles.list}>
        {content().map((chapter) => (
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
  );
}
