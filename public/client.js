function stuff(id, checked) {
  console.log("running: ", id);
  let hidden = document.getElementById("hidden");
  hidden.value = JSON.stringify({checked, id});

  document.forms[0].submit();
}

function deleteTodo(id) {
  let hidden = document.getElementById("hidden");
  hidden.value = JSON.stringify({id});

  document.forms[0].submit();
}
