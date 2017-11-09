
import { ready as scrollReady } from "./frontpage/scroll-animator"
import projectReady from "./frontpage/project-expansion";

export default function setUp() {
	scrollReady();
  	projectReady();
  	// LOL spammers
  	let ar = ["mailto:", "anthony", "@", "noided", ".", "media"];
  	document.getElementById("MailReplace").href = ar.join("");
}