import Link from "next/link";

interface Item {
  href: string;
  link: string;
  description: string;
}

const items: Item[] = [
  {
    href: "/earth",
    link: "Earth",
    description: "basic texture map",
  },
  {
    href: "/torus",
    link: "Torus",
    description: "displaced texture map",
  },
  {
    href: "/box",
    link: "Box",
    description: "orthographic instanced group",
  },
  {
    href: "/basic-shader",
    link: "Basic",
    description: "simple shader gradient",
  },
  {
    href: "/dotted-shader",
    link: "Dotted",
    description: "dotted fragment shader",
  },
];

const Index = () => {
  return (
    <main>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.href}>
              <Link href={item.href}>
                <a>{item.link}</a>
              </Link>{" "}
              — {item.description}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Index;
