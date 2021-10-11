import React from "react";

export default function ProjectStatus({ status, id }) {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div>
      {status?.title ? (
        <>
          <h4>{status.title}</h4>
          <p>{status?.text}</p>
        </>
      ) : null}
      {isEditing ? (
        <Modal size="medium" close={() => setIsEditing(false)}>
          <EditProjectStatus status={status} id={id} />
        </Modal>
      ) : (
        <button onClick={() => setIsEditing(true)}>edit</button>
      )}
    </div>
  );
}

function EditProjectStatus({ status, id }) {
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
          console.log(data);
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

function Modal({ children, close }) {
  return (
    <div className="">
      <button onClick={close}>&times;</button>
      {children}
    </div>
  );
}

function getUserId() {
  const identity = JSON.parse(localStorage.getItem("identity") || {});
  const { id } = identity && identity.user;
  return id;
}
