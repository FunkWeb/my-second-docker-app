import "./footer.style.css"

export function Footer() {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={"footer-component"}>
      <div className={"container"}>
        <p>
          Copyright © {startYear}{currentYear === startYear ? '' : ` - ${currentYear}`} FunkWeb.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
