import React from "react";
import styled from "styled-components";

export default function ProjectStatus({ initialStatus, id }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [status, setStatus] = React.useState(initialStatus);
  return (
    <div>
      {status?.title ? (
        <>
          <h4>{status.title}</h4>
          <p>{status?.text}</p>
        </>
      ) : null}
      {isEditing ? (
        <Modal
          size="medium"
          title="Edit Project Status"
          close={() => setIsEditing(false)}
        >
          <EditProjectStatus status={status} id={id} setStatus={setStatus} />
        </Modal>
      ) : (
        <button onClick={() => setIsEditing(true)}>edit</button>
      )}
    </div>
  );
}

function EditProjectStatus({ status, id, setStatus }) {
  const [form, setForm] = React.useState({
    title: status?.title || "",
    text: status?.text || "",
  });

  return (
    <div>
      <form
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
        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm((f) => {
              return {
                ...f,
                [e.target.name]: e.target.value,
              };
            })
          }
          name="title"
        />
        <textarea
          value={form.text}
          onChange={(e) =>
            setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
          }
          name="text"
        ></textarea>
      </form>
    </div>
  );
}

function Modal({ title, children, close }) {
  return (
    <ModalWrapper className="">
      <div className="inner-modal">
        <header>
          <h2>{title}</h2>
          <button onClick={close}>&times;</button>
        </header>
        {children}
      </div>
    </ModalWrapper>
  );
}

function getUserId() {
  const identity = JSON.parse(localStorage.getItem("identity") || {});
  const { id } = identity && identity.user;
  return id;
}

const ModalWrapper = styled.div`
  position: fixed;
  inset: 20px;
  display: grid;
  place-content: center;
  .inner-modal {
    background: white;
    box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
      0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 75%;
    min-width: 300px;
  }
`;
