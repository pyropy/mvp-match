import { Popover, Transition } from "@headlessui/react";
import * as React from "react";
import { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import Layout from "./components/Layout";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

/* HOOK REACT EXAMPLE */
const App = (props: AppProps) => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    async function getGreeting() {
      try {
        const res = await fetch("/api/hello");
        const greeting = await res.json();
        setGreeting(greeting);
      } catch (error) {
        console.log(error);
      }
    }
    getGreeting();
  }, []);

  return (
    <Layout>
		<h1>Hello World</h1>
    </Layout>
  );
};

interface AppProps {}

export default App;
