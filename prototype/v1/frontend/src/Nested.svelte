<script>
  let cats = [
    { id: "J---aiyznGQ", name: "Keyboard Cat" },
    { id: "z_AbfPXTKms", name: "Maru" },
    { id: "OUtn3pvWmpg", name: "Henri The Existential Cat" },
  ];

  let sessionData = fetchSessionData();

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

<h1>The Famous Cats of YouTube</h1>

<ul>
  <!-- open each block -->
  {#each cats as { id, name } (id)}
    <li>
      <a target="_blank" href="https://www.youtube.com/watch?v={id}">
        {id}:
        {name}
      </a>
    </li>
  {/each}
  <!-- close each block -->
</ul>
{#await sessionData then {sessionId, token, apiKey}}
  <p>{token}</p>
  <p>{sessionId}</p>
  <p>{apiKey}</p>
{/await}


<button on:click={handleClick}> get session info </button>
