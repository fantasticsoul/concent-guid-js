import React, { Component } from "react";
import { register, useConcent, cst } from "concent";
import Field from "components/dumb/Field";

/**
 * welcome to experience this demo, and fork to modify it. ^_^
 * concent build a ctx for every instance, it supplies state, sync, dispatch and etc ...
 * you can use them in any of components bellow
 * more details see doc: https://concentjs.github.io/concent-doc/api/explain
 *
 * and your can copy left side bar other file's content to experience
 * like register-hook-comp.js ...
 *
 * visit more demos:
 * https://stackblitz.com/edit/cc-multi-ways-to-wirte-code
 * https://stackblitz.com/edit/cc-4-render-mode
 * https://stackblitz.com/@fantasticsoul
 */

const iState = () => ({
  greetingVisible: true,
  nameVisible: true
});

const setup = ctx => {

  const sendDep = () => {
      const tag = ctx.props.tag;
      const tip = `current dep is:` + ctx.getWatchedKeys().join(",");
      ctx.emit("show_dep", { tag, tip });
  };

  ctx.effect((_, isFirstCall) => {
    if (isFirstCall) {
      // wait ShowDependency ins mount
      setTimeout(sendDep, 1000);
    } else {
      sendDep();
    }
  });
};

function HookFnComp(props) {
  console.log("%c HookFnComp", "color:green;");
  const ctx = useConcent({ module: "foo", state: iState, setup, props });
  //or use ctx.setState, ctx.dispatch, ctx.invoke instead
  const { state, sync, syncBool } = ctx;
  return (
    <div className="box">
      concent will collect dependency if user not pass watchedKeys
      <span className="tag is-info">
        try click toggle greetingVisible button and then input greeting in Class
        Comp
      </span>
      <span className="tag is-danger">
        the HookFnComp will not been trigger re-render!
      </span>
      <br /> <br />

      <div className="field">
        <div className="control is-small">
          {state.greetingVisible ? (
            <Field
              title="greeting:"
              value={state.greeting}
              onChange={sync("greeting")}
            />
          ) : (
            ""
          )}
          {state.nameVisible ? (
            <Field title="name:" value={state.name} onChange={sync("name")} />
          ) : (
            ""
          )}
          <button onClick={syncBool("greetingVisible")}>
            toggle greetingVisible
          </button>
          <button onClick={syncBool("nameVisible")}>toggle nameVisible</button>
        </div>
      </div>
    </div>
  );
}

@register({ module: "foo", setup })
class HocClassComp extends Component {
  state = iState();
  render() {
    console.log("%c HocClassComp ", "color:green;");
    const { greeting } = this.state; // or this.ctx.state
    const { sync } = this.ctx;
    const changeBySync = sync("greeting");

    return (
      <div className="box">
        I am2 <span className="tag is-success">Class</span> Comp &nbsp;
        <h1 className="title">{greeting}</h1>
        <Field title="greeting:" value={greeting} onChange={changeBySync} />
      </div>
    );
  }
}

const fragReg = {
  setup: ctx => {
    ctx.on("show_dep", ({ tag, tip }) => {
      const tipMap = ctx.state.tipMap;
      tipMap[tag] = tip;
      ctx.setState({ tipMap });
    });
  },
  state: { tipMap: {} }
};

function ShowDependency() {
  const ctx = useConcent(fragReg);
  const tipMap = ctx.state.tipMap;
  return Object.keys(tipMap).map((tag, idx) => {
    return (
      <div key={idx}>
        {tag}: {tipMap[tag]}
      </div>
    );
  });
}

export default function ExactUpdate() {
  console.log("%c BasicDemo ", "color:green;");
  return (
    <>
      <HookFnComp tag="fnComp" />
      <HocClassComp tag="classComp" />
      <ShowDependency />
    </>
  );
}
