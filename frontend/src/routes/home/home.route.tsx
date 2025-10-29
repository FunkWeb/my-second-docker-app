import {Button} from "../../components/button/button.component.tsx";
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
        <h3>Information</h3>
        <p>This is built as a Single Page Application (SPA). What's that?</p>
      </section>
      <section>
        <h3>Questions</h3>
        <p>When you refresh the page, or navigate between pages, the Interactive Button count resets. Why?</p>
        <p>When you navigate between pages, the useAuth context stays the same. Why?</p>
      </section>
      <section>
        <h3>Interactive Button</h3>
        <Button onClick={() => setCount(++count)}>Click me!</Button>
        <p>Button clicked {count} times.</p>
      </section>
    </div>
  );
}
