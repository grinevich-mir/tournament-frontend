<template>
  <div class="affiliates-home">

    <!-- <img src="@/assets/banner-placeholder.jpg" alt=""> -->

    <h1 class="affiliates-home__heading">WELCOME TO TOURNAMENT AFFILIATES</h1>

    <p class="affiliates-home__body">
      Become an official affiliate of Tournament, join now.  Why not earn extra revenue by joining Tournament Affiliates today.
      <br><br>
      Creating an account is quick and easy. Once approved you will have all the tools you need to start promoting Tournament and start earning extra revenue.
    </p>

    <a class="affiliates__link register" href="https://affiliates.tournament.com/registration.asp">GET STARTED</a>

  </div>
</template>

<script>
export default {
  name: 'AffiliatesHome',
};
</script>

<style lang="scss">
  .affiliates-home {
    display: flex;
    flex-direction: column;
    align-items: center;

    & .affiliates-home__heading {
      text-align: center;
      font-size: 42px;
      margin: 4rem 0;
    }

    & .affiliates-home__body {
      line-height: 1.5;
      font-size: 18px;
      padding: 0 2rem;
    }

    & .affiliates__link.register {
      padding: 8px 14px;
      border-radius: 50px;
      font-size: 10px;
      color: #fff;
      font-weight: 600;
      letter-spacing: 1.7px;
      text-decoration: none;
      text-transform: uppercase;
      background-color: $blue;
      font-size: 18px;
      margin-top: 4rem;
      padding: 15px 2rem;
    }
  }

  @media (max-width: 767px) {
    .affiliates-home .affiliates-home__heading {
      font-size: 32px;
    }
  }
</style>
