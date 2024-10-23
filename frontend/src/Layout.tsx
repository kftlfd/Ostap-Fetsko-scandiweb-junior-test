export function Header(props: {
  heading: string;
  middle?: React.ReactNode;
  buttons?: React.ReactNode;
}) {
  return (
    <header>
      <h1 className="heading">{props.heading}</h1>

      {props.middle && <div className="middle">{props.middle}</div>}

      {props.buttons && <div className="buttons">{props.buttons}</div>}
    </header>
  );
}

export function Main(props: { children?: React.ReactNode }) {
  return <main>{props.children}</main>;
}

export function Footer() {
  return (
    <footer>
      <span>Products DB</span>
      <span>&bull;</span>
      <a href="https://github.com/kftlfd/productsdb" target={"_blank"}>
        GitHub
      </a>
    </footer>
  );
}
