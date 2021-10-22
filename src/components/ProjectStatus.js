import React from "react";
import styled from "styled-components";

export default function ProjectStatus({ initialStatus, id }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [status, setStatus] = React.useState(initialStatus);
  const [buttonAnchor, setButtonAnchor] = React.useState(0);
  const titleRef = React.useRef();
  React.useLayoutEffect(() => {
    if (titleRef?.current) {
      setButtonAnchor(positionEnd(titleRef.current));
    }
  }, [status]);
  return (
    <StatusWrapper>
      {status?.title ? (
        <>
          <h4>
            <span ref={titleRef}>{status.title}</span>
          </h4>
          <p>{status?.text}</p>
        </>
      ) : (
        <span style={{ fontSize: `14px` }} ref={titleRef}>
          Add a status
        </span>
      )}
      {isEditing ? (
        <Modal
          size="medium"
          title="Edit Project Status"
          close={() => setIsEditing(false)}
        >
          <EditProjectStatus status={status} id={id} setStatus={setStatus} />
        </Modal>
      ) : (
        <button
          style={{
            "--anchor": buttonAnchor,
          }}
          onClick={() => setIsEditing(true)}
          title="edit status"
        >
          <PenIcon />
        </button>
      )}
    </StatusWrapper>
  );
}

function EditProjectStatus({ status, id, setStatus }) {
  const [form, setForm] = React.useState({
    title: status?.title || "  ",
    text: status?.text || "  ",
  });

  return (
    <div>
      <StackedForm
        onSubmit={async (e) => {
          e.preventDefault();
          const data = await fetch(
            `${window.location.origin}/api/update-project-status`,
            {
              method: "POST",
              body: JSON.stringify({
                newStatus: form,
                userId: getUserId(),
                projId: id,
              }),
            }
          ).then((res) => res.json());
          const { text, title } = data;
          setStatus({ text, title });
        }}
      >
        <label htmlFor="title">
          <span className="label">Title</span>
          <input
            type="text"
            value={form.title}
            style={{ fontSize: "22px" }}
            onChange={(e) =>
              setForm((f) => {
                return {
                  ...f,
                  [e.target.name]: e.target.value,
                };
              })
            }
            id="title"
            name="title"
            required
          />
        </label>

        <label htmlFor="text">
          <span className="label">Details</span>
          <textarea
            required
            value={form.text}
            id="text"
            onChange={(e) =>
              setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            name="text"
          />
        </label>
        <button type="submit">Save</button>
      </StackedForm>
    </div>
  );
}

const StackedForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  input,
  textarea {
    width: 100%;
  }
  label {
    .label {
      font-weight: bold;
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }
  }
  textarea {
    height: 200px;
    resize: none;
  }
  button {
    padding: 8px 16px;
    height: auto !important;
  }
`;

function Modal({ title, children, close }) {
  return (
    <ModalWrapper className="">
      <div className="inner-modal">
        <header>
          <h2>{title}</h2>
          <button onClick={close}>
            <svg viewBox="0 0 20 20">
              <path d="M0,0 L20,20 M20,0 L0,20" />
            </svg>
          </button>
        </header>
        <div className="modal-content">{children}</div>
      </div>
    </ModalWrapper>
  );
}

function getUserId() {
  const identity = JSON.parse(localStorage.getItem("identity") || {});
  const { id } = identity && identity.user;
  return id;
}

const PenIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    dataPrefix="fas"
    dataIcon="pen"
    class="svg-inline--fa fa-pen fa-w-16"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
    ></path>
  </svg>
);

const StatusWrapper = styled.div`
  position: relative;
  & > button {
    font-size: 12px;
    display: grid;
    place-content: center;
    background: transparent;
    color: #c3d2e6;
    width: 2em;
    height: 2em;
    position: absolute;
    top: -0.25em;
    left: var(--anchor);
  }
`;
function positionEnd(el) {
  const { width } = el.getBoundingClientRect();
  return `${width + 8}px`;
}
const ModalWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: #00000044;
  display: flex;
  align-items: center;
  justify-content: center;
  .inner-modal {
    background: white;
    position: relative;
    box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
      0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    min-width: 300px;
    width: 100%;
    max-width: min(75%, 500px);
    overflow: hidden;

    header {
      background: #eff6ff;
      position: relative;
      padding: 8px 10px;
      h2,
      h3,
      h4 {
        margin: 0;
      }
      & > button {
        position: absolute;
        margin: 0;
        padding: 1em;
        height: 100%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        border-color: transparent;
        top: 0;
        color: #1e3a8a;
        border-radius: 0;
        &:hover {
          color: white;
          background: #1e3a8a;
        }
        &:active {
          box-shadow: none;
        }
      }
    }
    button svg {
      width: 1em;
      height: 1em;
      stroke: currentColor;
      stroke-width: 3px;
    }
  }
  .modal-content {
    padding: 10px;
  }
`;
