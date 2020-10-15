import * as React from "react";
import styles from "./index.module.scss";

export class TestComponent extends React.PureComponent {
    public render() {
        return <div className={styles.sampleComponent}>This is a fantastic test component.</div>;
    }
}
