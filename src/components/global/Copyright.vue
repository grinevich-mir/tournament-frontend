<template>
  <div class="copyright">
    <div class="container">
      <p class="copyright--text">Copyright &copy; {{ new Date().getFullYear() }} Tournament</p>
      <div class="company-info copyright--text">
        <p>Tournament Entertainment Limited</p>
        <p>Registered in Ireland with registered number 610593.</p>
        <p>77 Sir John Rogersons’s Quay, Dublin 2, Ireland DO2 F540</p>
        <p>VAT number: IE 3497687H</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Copyright',
};
</script>

<style scoped lang="scss">
  .copyright--text {
    margin: 0;
    color: $kimberly;
    text-align: center;
    font-size: 12px;
  }
  .copyright {
    font-weight: 600;

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .company-info {
        margin-top: 2rem;
        width: 300px;
        font-weight: normal;
        font-size: 10px;
      }
    }
  }

</style>
