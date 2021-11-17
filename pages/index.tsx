import Link from "next/link";

const Index = () => {
  return (
    <main>
      <ul>
        <li>
          <Link href="/earth">
            <a>Earth</a>
          </Link>
          : A basic texture map
        </li>
        <li>
          <Link href="/torus">
            <a>Torus</a>
          </Link>
          : Complex texture maps
        </li>
      </ul>
    </main>
  );
};

export default Index;
