import {Button} from "../../../components/button/button.component.tsx";
import {useState} from "react";

export default function Home() {
  let [count, setCount] = useState(0);

  return (
    <div className={"container"}>
      <section>
        <h2>Home Page</h2>
        <p>This is the home page of the application.</p>
      </section>
      <section>
        <Button onClick={() => setCount(++count)}>Click me!</Button>
        <p>Button clicked {count} times.</p>
      </section>
    </div>
  );
}
