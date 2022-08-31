<template>
  <div class="affiliates-contact">
    <h1 :class="{ left: $route.name === 'Contact' }">Contact us</h1>

    <p>If you have any queries, questions or suggestions, we’d love to hear them. Use the form below or alternatively drop us a line directly at <strong>{{contactEmail}}</strong> and we’ll get right back to you.</p>

    <form @submit.prevent="submit">

      <div class="contact__info">
        <div class="input-container">
          <input v-model="name" type="text" name="name" required>
          <label for="name">Name</label>
        </div>

        <div class="input-container">
          <input v-model="email" type="email" name="email" required :class="{ 'not-empty': email.length }">
          <label for="email">Email</label>
        </div>
      </div>

      <div class="contact__info" :class="{ solo: $route.name === 'Contact' }">
        <div class="input-container">
          <input v-model="phone" type="text" name="phone" :class="{ 'is-empty': !phone.length }">
          <label for="phone">Telephone</label>
        </div>

        <div class="input-container" v-if="$route.name === 'AffiliateContact'">
          <input v-model="sites" type="text" name="sites" :class="{ 'is-empty': !sites.length }">
          <label for="sites">Affiliate sites</label>
        </div>
      </div>

      <div class="input-container textarea">
        <textarea v-model="message" name="message" required></textarea>
        <label for="name">Message</label>
      </div>

      <Button type="submit" text="Send" variant="rounded-blue" />
    </form>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'AffiliatesContact',
  components: {
    Button,
  },
  // props: {
  //   contactEmail: {
  //     type: String,
  //     default: 'affiliates@tournament.com',
  //   },
  // },
  data() {
    return {
      contactEmail: 'affiliates@tournament.com',
      emailSubject: '[Tournament Affiliates] Contact',
      name: '',
      email: '',
      phone: '',
      sites: '',
      message: '',
    };
  },
  created() {
    if (this.$route.name === 'Contact') {
      this.contactEmail = 'support@tournament.com';
      this.emailSubject = '[Tournament] Contact';
    }
  },
  computed: {
    emailBody() {
      if (this.$route.name === 'Contact') {
        return `Name: ${this.name}%0AEmail: ${this.email}%0ATelephone: ${this.phone}%0A%0AMessage: ${this.message.replace(/[\n\r]/g, '%0A')}`;
      }
      return `Name: ${this.name}%0AEmail: ${this.email}%0ATelephone: ${this.phone}%0AAffiliate sites: ${this.sites}%0A%0AMessage: ${this.message.replace(/[\n\r]/g, '%0A')}`;
    },
  },
  methods: {
    submit() {
      if (!this.name || !this.email || !this.message) return;
      window.location.href = `mailto:${this.contactEmail}?subject=${this.emailSubject}&body=${this.emailBody}`;
    },
  },
};
</script>

<style lang="scss">
  .affiliates-contact {
    h1 {
      text-align: center;
      margin-bottom: 3rem;

      &.left {
        text-align: left;
      }
    }
    p {
      line-height: 1.5;
    }

    form {
      max-width: 680px;

      & .contact__info {
        display: flex;
        justify-content: space-around;

        &.solo {
          justify-content: flex-start;

          & .input-container {
            width: 332px;
            margin: 0;
            margin-top: 45px;
          }
        }
      }

      .input-container {
        width: 75%;
        position: relative;
        margin: 45px auto -25px;

        &:first-of-type {
          margin-right: 1rem;
        }

        &.textarea {
          width: 100%;
          margin-right: 0;
        }

        & input, textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 2rem;
          color: #fff;
          background-color: $light-navy;
          border: none;
          border-bottom: solid 2px $blue;
          outline: none;
          border-radius: 3px;

          & ~ label {
            left: 10px;
          }

          &.is-empty ~ label {
            top: 10px !important;
            left: 10px !important;
          }

          &:focus ~ label {
            top: -20px !important;
            left: 0 !important;
          }

          &:valid ~ label, &.not-empty ~ label {
            top: -20px;
            left: 0;
          }
        }

        & textarea {
          height: 200px;
          padding: 10px;
        }

        & label {
          position: absolute;
          top: 10px;
          left: 10px;
          color: $kimberly;
          transition: all .2s ease;
          pointer-events: none;
          z-index: 10;
        }

      }

      .button {
        margin-top: 1rem;
        width: 50%;
      }
    }
  }

  @media (max-width: 767px) {
    .affiliates-contact {
      & .contact__info {
        flex-direction: column;

        & .input-container {
          width: 100% !important;

          & input, textarea {
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
</style>
