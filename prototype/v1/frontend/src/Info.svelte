<script>
  import { createEventDispatcher } from "svelte";
  import Video from "./Video.svelte";
  const dispatch = createEventDispatcher();

  let sessionData = fetchSessionData();

  function sayHello() {
    dispatch("message", {
      sessionData,
    });
  }

  async function fetchSessionData() {
    const res = await fetch("http://localhost:8000/room/blade2");
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function handleClick() {
    sessionData = fetchSessionData();
  }
</script>

<h1>session info</h1>
<button on:click={sayHello}> Click to say hello </button>
{#await sessionData then { sessionId, token, apiKey }}
  <p>{token}</p>
  <p>{sessionId}</p>
  <p>{apiKey}</p>
{/await}

{#await sessionData then { sessionId, token, apiKey }}
  <Video {apiKey} {sessionId} {token} />
{/await}

<button on:click={handleClick}> get session info </button>
