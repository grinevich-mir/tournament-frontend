<template>
  <div class="affiliates-commission">
    <h1>Commission</h1>
    <p>
      Here at Tournament Affiliates our commission structure is based on the number of first time depositors that you refer to us in any single calendar month.
      We then use a net revenue share model in line with the table below to reward you a percentage of your players losses.
      <br><br>
      Our goal is to generate and develop solid, long term relationships and as we grow, we want you to grow too. Don’t forget that revenue is earned during the lifetime of your players.
      <br><br>
      In addition, if you have any ideas or suggestions we are always open to listen to your specific needs as per your volumes and traffic channels.
      <router-link :to="{ name: 'AffiliatesContact' }">Click here to contact us.</router-link>
    </p>
    <table>
      <tr>
        <th>Number of Subscription Paying Players</th>
        <th>Commission Rate</th>
      </tr>
      <tr>
        <td>1 +</td>
        <td>$5</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AffiliatesCommission',
};
</script>

<style lang="scss">
  .affiliates-commission {
    h1 {
      text-align: center;
      margin-bottom: 3rem;
    }

    p {
      line-height: 1.5;
    }

    table {
      margin: auto;
      margin-top: 3rem;

      &, th, td {
      border: 1px solid $blue;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
    }
    }
  }
</style>
