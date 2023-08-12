import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./Table.module.css";

type TagType = "H1" | "H2";

type Content = {
  title: string;
  number?: number;
  href: string;
  type: TagType;
};

export default function Table() {
  const [currentItem, setCurrentItem] = createSignal(1);
  const [isOpen, setIsOpen] = createSignal(true);
  const headings = getHeadings();
  const content = generateContent();
  const observer = new IntersectionObserver(onObserve, {
    threshold: 1,
  });

  for (const item of headings.values()) {
    observer.observe(item);
  }

  function generateContent() {
    let result: Content[] = [];
    let number = 0;
    for (const heading of headings) {
      let id = heading.getAttribute("id");
      let content = heading.innerText;
      let tagname = heading.tagName as TagType;
      if (tagname != "H1" && tagname != "H2") {
        console.log("unknown tagname", tagname);
        continue;
      }
      if (id && content) {
        if (tagname == "H1") {
          result.push({
            href: `#${id}`,
            title: content,
            type: tagname,
            number: ++number,
          });
        } else {
          result.push({ href: `#${id}`, title: content, type: tagname });
        }
      }
    }
    return result;
  }

  function onObserve(entries: IntersectionObserverEntry[]) {
    const entry = entries[entries.length - 1];
    console.log(entries.length);

    let number = 0;
    headings.forEach((heading) => {
      if (heading.tagName == "H1") number++;
      if (entry.target !== heading) return;
      if (entry.isIntersecting) {
        setCurrentItem(number);
        console.log("setting current item: ", number);
        return;
      }
    });
  }

  function getHeadings() {
    return document.querySelectorAll<HTMLHeadingElement>(".heading");
  }

  function onResize() {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  onMount(() => {
    window.addEventListener("resize", onResize);
  });
  onCleanup(() => {
    window.removeEventListener("resize", onResize);
  });

  return (
    <>
      {isOpen() && (
        <div class={styles.container}>
          <ol class={styles.list}>
            {content.map((item) => {
              return (
                <li
                  class={`${styles.item} ${
                    item.number == currentItem() ? styles.active : ""
                  }`}
                >
                  <a
                    class={`${styles.link} ${
                      item.type == "H2" && styles.subtitle
                    }`}
                    href={item.href}
                  >
                    {item.type == "H1" ? (
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
