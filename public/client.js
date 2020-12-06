function stuff(id) {
  console.log("running: ", id);
  let hidden = document.getElementById("hidden");
  hidden.value = id;

  document.form.submit();
}
