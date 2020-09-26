import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import styles from "./sampleComponent.module.scss";
import styles2 from "./something/burried/testThisModule.module.scss";

ReactDOM.render(
    <div className={styles2.test}>Hello world, <span className={styles.yellowMyFriend}>this is blue indium.</span></div>,
    document.getElementById("main-app"),
);
