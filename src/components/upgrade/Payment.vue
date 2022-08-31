<template>
  <div class="payment">
    <div class="get-premium">
      <div class="container">
        <h2>Get Premium</h2>
        <p><img svg-inline src="@/assets/check.svg" class="get-premium__check"/>$1000s of cash prizes every week</p>
        <p><img svg-inline src="@/assets/check.svg" class="get-premium__check"/>Chat and community features</p>
        <p><img svg-inline src="@/assets/check.svg" class="get-premium__check"/>No commitments, cancel anytime</p>
      </div>
    </div>

    <div class="payment__selected-plan">
      <p v-if="fromRegister" class="step">Step 3 of 3</p>
      <div class="your-plan">
        <p>Your plan</p>
        <a v-if="fromRegister" @click="setStep(1)">Change plan</a>
      </div>
      <div class="plan-summary">
        <div class="free-trial" v-if="newSubscriber && freeTrialEnabled">24h free trial</div>
        <h4 class="plan-name">Tournament {{selectedPlan}}</h4>
        <p class="plan-price"><strong>${{price}}</strong> / month <template v-if="freeTrialEnabled">after trial</template></p>
        <p class="cancel-message">{{ selectedPlan === 'basic' ? 'Upgrade' : 'Cancel' }} anytime. <router-link :to="{ name: 'TermsConditions' }">Terms &amp; Conditions</router-link> apply.</p>
      </div>
      <p v-if="selectedPlan === 'basic'" class="payment__info">
        We ask card details from all players (even free players) for age verification reasons.
        We also try to pay winnings out to cards where possible.
      </p>
    </div>

    <form id='chargify-form' class="payment__form" @submit.prevent="submitChargify">
      <div class="chargify-element" :class="{ loading: isLoading }">
        <transition-group name="fade">

          <template v-if="paymentMethod">
            <p :key="0" class="payment__choose-type">Choose your payment method</p>
            <div :key="1" class="payment__input card-type">
              <select v-model="card" name="paymentMethod">
                <option value="default" >
                  {{ paymentMethod.cardType }} &bull;&bull;&bull;&bull; {{ paymentMethod.lastFour }} <small>Expires {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear }}</small>
                </option>
                <option value="new">Add new payment method</option>
              </select>
            </div>
          </template>
          <p v-else :key="1" class="payment__choose-type">Set up your credit or debit card</p>

          <div :key="2" class="payment-types">
            <img svg-inline src="@/assets/payments/visa.svg" alt="Visa">
            <img svg-inline src="@/assets/payments/mastercard.svg" alt="Mastercard">
            <img svg-inline src="@/assets/payments/american-express.svg" alt="American Express">
            <img svg-inline src="@/assets/payments/discover.svg" alt="Discover">
            <img class="ssl" svg-inline src="@/assets/payments/ssl.svg" alt="Secured SSL Certificate">
          </div>

          <div :key="3" v-show="card === 'new'">
            <div>
              <div class="payment__input">
                <input
                  v-model="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  data-recurly="first_name"
                >
              </div>

              <div class="payment__input">
                <input
                  v-model="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  data-recurly="last_name"
                >
              </div>
            </div>

            <div>
              <div id="chargify1" class="payment__input" ref="chargifyelements1" v-show="!isLoading">
                <!-- Chargify elements will be attached here CARD NUMBER -->
              </div>
              <div id="chargify2" class="payment__input" ref="chargifyelements2">
                <!-- Chargify elements will be attached here MONTH -->
              </div>
              <div id="chargify3" class="payment__input" ref="chargifyelements3">
                <!-- Chargify elements will be attached here YEAR -->
              </div>
              <div id="chargify4" class="payment__input" ref="chargifyelements4">
                <!-- Chargify elements will be attached here CVV -->
              </div>
              <div id="chargify5" class="payment__input" ref="chargifyelements5">
                <!-- Chargify elements will be attached here ZIP -->
              </div>
              <div class="host-field">
                <input type="hidden" class="host-input" data-chargify="country" :value="country"/>
              </div>

              <div class="chargify-element">
                <div class="payment__input card-type acc-input-wrap acc-input-wrap--hasselect">
                  <select class="acc-input acc-input--editable" :class="{'is-placeholder': !country}" v-model="country">
                    <option value="" disabled>Country</option>
                    <option value="AX">Åland Islands</option>
                    <option value="AL">Albania</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AI">Anguilla</option>
                    <option value="AQ">Antarctica</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia, Plurinational State of</option>
                    <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">British Indian Ocean Territory</option>
                    <option value="BN">Brunei Darussalam</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos (Keeling) Islands</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo</option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="HR">Croatia</option>
                    <option value="CW">Curaçao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands (Malvinas)</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Territories</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HM">Heard Island and McDonald Islands</option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IM">Isle of Man</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KR">Korea, Republic of</option>
                    <option value="KW">Kuwait</option>
                    <option value="LA">Lao People's Democratic Republic</option>
                    <option value="LV">Latvia</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia, Federated States of</option>
                    <option value="MD">Moldova, Republic of</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RE">Réunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russian Federation</option>
                    <option value="BL">Saint Barthélemy</option>
                    <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="MF">Saint Martin (French part)</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SG">Singapore</option>
                    <option value="SX">Sint Maarten (Dutch part)</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="ZA">South Africa</option>
                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="TW">Taiwan, Province of China</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania, United Republic of</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="UM">United States Minor Outlying Islands</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VN">Viet Nam</option>
                    <option value="VG">Virgin Islands, British</option>
                    <option value="VI">Virgin Islands, U.S.</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="ZM">Zambia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="isLoading" class="payment__loading-overlay">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>

      <div class="payment__actions">
        <input id="chargify-token" type="hidden" />
        <Button
          :text="selectedPlan === 'premium' ? 'Get Premium' : 'Continue'"
          variant="rounded-blue"
          type="submit"
          :disabled="isLoading"
        />
      </div>

      <template v-if="selectedPlan === 'premium'">
        <p class="payment__info">I understand that by clicking Get Premium my payment method will be debited by the amount shown above and each month thereafter if I choose not to cancel my membership.</p>
        <p class="payment__info">All payments are secure under 256-bit SSL encryption across all services.</p>
        <p class="payment__info">You can modify or cancel your subscription at any moment from your profile page. For more informations please read our <router-link :to="{ name: 'TermsConditions' }">Terms and Conditions</router-link>.</p>
      </template>
    </form>
    <Modal
      v-model="showConfirmModal"
      :title="modalTitle"
      :mode="modalMode"
    >
      <template v-slot:title>
        <img v-if="modalError" class="modal-error-icon" src="@/assets/cancel.svg" alt="Error">
        <h2 class="modal-title">
          {{modalTitle}}
        </h2>
      </template>
      <template v-if="modalError" v-slot:body>
        <p>We haven't been able to process this payment.</p>

        <p><strong>{{modalErrorMessage}}</strong></p>

        <p>If you continue to have problems, please contact customer support.</p>
      </template>
      <template v-else v-slot:body>
        Thank you for becoming a new member of Tournament. Let's hope you're our next big winner!
      </template>
      <template v-if="modalError" v-slot:buttons>
        <Button variant="rounded-blue" text="Continue" @clicked="closeModal" />
      </template>
      <template v-else v-slot:buttons>
        <Button class="gtm-sub" variant="rounded-blue" text="Continue" @clicked="afterNewSubscription" />
      </template>
    </Modal>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
import Modal from '@/components/global/Modal.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'Payment',
  props: ['fromRegister', 'setStep', 'selectedPlan'],
  components: {
    Button,
    Modal,
  },
  data() {
    return {
      card: 'new',
      firstName: null,
      lastName: null,
      country: null,
      isLoading: false,
      paymentMethod: null,
      defaultMethodSelected: null,
      recurlyErrors: [],
      price: process.env.VUE_APP_SUBSCRIPTION_PRICE,
      selectedVariantId: process.env.VUE_APP_SUBSCRIPTION_VARIANT_1999,
      freeTrialEnabled: false,
      showConfirmModal: false,
      modalError: false,
      modalTitle: 'Welcome on board!',
      modalMode: 'jackpot',
      modalErrorMessage: 'Transaction failed',
    };
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData;
    },
    newSubscriber() {
      if (!this.$store.state.auth.userData) {
        return true;
      }

      return !this.$store.state.auth.userData.subscribed;
    },
  },
  created() {
    this.isLoading = true;
    if (this.selectedPlan === 'basic') {
      this.price = '0.00';
    }
    this.$api.get('/payment/method')
      .then((response) => {
        this.paymentMethod = response.data;
        this.defaultMethodSelected = true;
        this.card = 'default';
      })
      .catch((error) => {
        this.defaultMethodSelected = false;
        console.error(error);
      })
      .finally(() => {
        if (this.userData && typeof this.userData.country !== 'undefined' && this.userData.country) {
          this.country = this.userData.country;
        }
        this.mountChargify().finally(() => {
          this.isLoading = false;
        });
      });
  },
  beforeDestroy() {
    this.destroyChargify();
  },
  methods: {
    destroyChargify() {
      if (this.chargify) {
        this.chargify.unload();
      }
      this.chargify = null;
    },
    mountChargify() {
      this.chargify = new window.Chargify();
      return this.chargify.load({
        selector: '#chargify1',
        publicKey: process.env.VUE_APP_CHARGIFY_PUBLICKEY,
        type: 'card',
        serverHost: `https://${process.env.VUE_APP_CHARGIFY_SUBDOMAIN}.chargify.com`,
        hideCardImage: true,
        fields: {
          number: {
            selector: '#chargify1',
          },
          month: {
            selector: '#chargify2',
            placeholder: 'Expiry month (MM)',
          },
          year: {
            selector: '#chargify3',
            placeholder: 'Expiry year (YYYY)',
          },
          cvv: {
            selector: '#chargify4',
            required: true,
          },
          zip: {
            selector: '#chargify5',
            required: true,
            placeholder: 'Zip/Postal Code',
          },
          // country: {
          //   selector: '#chargify5',
          //   required: true,
          //   placeholder: 'Country',
          //   maxlength: 2,
          // },
        },
        style: {
          label: {
            backgroundColor: 'transparent',
            display: 'none',
          },
          field: {
            backgroundColor: 'transparent',
            borderRadius: '0',
            margin: '0',
          },
          input: {
            height: '40px',
            width: '100%',
            color: '#000',
            // '-webkit-text-fill-color': '#4D4D4D !important',
            border: '1px solid #5A5A5A',
            borderRadius: '5px',
            textAlign: 'left',
            padding: '0 10px',
            fontSize: '14px',
            backgroundColor: 'transparent',
            placeholder: { color: '#707070' },
          },
        },
      });
    },
    submitChargify(e) {
      e.preventDefault();
      if (this.$parent.isLoading) {
        return;
      }

      EventBus.$emit('upgrade/is-loading', true);

      this.recurlyErrors = [];
      if (this.defaultMethodSelected && this.selectedPlan === 'premium') {
        this.createNewSubscription();
        return;
      }
      this.chargify.token(
        e.target,
        (token) => {
          const srvReqParams = {
            token,
            firstName: this.firstName,
            lastName: this.lastName,
          };
          this.$api.post('/payment/method', srvReqParams)
            .then((response) => {
              this.paymentMethod = response.data;
              this.defaultMethodSelected = true;
              if (this.selectedPlan === 'premium') {
                this.createNewSubscription();
              } else {
                this.$router.push({ name: 'Lobby' });
              }
            })
            .catch((error) => {
              console.error(error);
              EventBus.$emit('upgrade/is-loading', false);
            });
        },
        (err) => {
          console.log('token ERROR - err: ', err);
          if (err.message) {
            this.$noty.error(err.message);
          } else if (err.errors) {
            this.$noty.error(typeof err.errors === 'string' ? err.errors : err.errors[0]);
          }
          EventBus.$emit('upgrade/is-loading', false);
        },
      );
    },
    createNewSubscription() {
      EventBus.$emit('upgrade/is-loading', true);
      this.$api.post('/upgrade/subscription/1', {
        variantId: this.selectedVariantId,
      })
        .then(() => {
          this.modalError = false;
          this.modalTitle = 'Welcome on board!';
          this.modalMode = 'jackpot';
          this.showConfirmModal = true;
        })
        .catch((err) => {
          console.log('token ERROR - err: ', err);

          this.modalError = true;
          this.modalTitle = 'Failed Payment';
          this.modalMode = 'default';

          // @TODO: uncomment this when error messages are handled server-side
          // if (err.response.data && err.response.data.message) {
          //   this.modalErrorMessage = err.response.data.message;
          // } else if (err.message) {
          //   this.modalErrorMessage = err.message;
          // } else if (err.errors) {
          //   this.modalErrorMessage = typeof err.errors === 'string' ? err.errors : err.errors[0];
          // }
          this.showConfirmModal = true;
        })
        .finally(() => {
          EventBus.$emit('upgrade/is-loading', false);
        });
    },
    afterNewSubscription() {
      this.fetchCurrentSub();
      this.$store.dispatch('loadUserData')
        .then(() => {
          if (this.fromRegister) {
            return this.$router.push({ name: 'Lobby' });
          }
          return this.$router.push({ name: 'Profile' });
        })
        .finally(() => {
          this.showConfirmModal = false;
        });
    },
    fetchCurrentSub() {
      this.isLoading = true;
      this.$store.dispatch('loadSubscription')
        .finally(() => {
          this.isLoading = false;
        });
    },
    closeModal() {
      this.showConfirmModal = false;
    },
  },
};
</script>

<style lang="scss">
  .payment {
    margin-top: 11vh;

    .get-premium {
      background-color: $blue;
      color: #fff;
      width: 100%;
      line-height: 1.5;
      position: absolute;
      top: 12%;
      left: 0;

       & .container {
        width: 370px;
        padding: 1rem;
      }

      & .get-premium__check {
        width: 13px;
        margin-right: 8px;

        & path {
          fill: #fff;
        }
      }
    }

    .payment__selected-plan {
      margin-bottom: 1rem;

      .your-plan {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;

        & a {
          color: #909090;
          text-decoration: underline;
          cursor: pointer;
        }
      }

      .plan-summary {
        border: 1px solid $light-grey;
        border-radius: 6px;
        background-color: #F7F8FB;
        padding: 1.3rem 1.1rem;

        & .free-trial {
          width: fit-content;
          margin-bottom: 14px;
          background-color: #4C8AD1;
          border-radius: 3px;
          color: #fff;
          padding: 6px 14px;
          font-size: 12px;
        }

        & p,
        & .plan-name {
          margin-bottom: 15px;
        }

        & .plan-name {
          text-transform: capitalize;
        }

        & .plan-price {
          font-size: 14px;
        }

        & .cancel-message {
          font-size: 12px;
          margin-bottom: 0;

          & a {
            color: #000;
          }
        }
      }
    }
  }

  .payment__form {
    & .chargify-element.loading {
      position: relative;
      height: 300px;
      margin-bottom: 10px;
      padding-top: 1rem;


      & .payment__input,
      & .payment__choose-type,
      & .payment-types {
        display: none;
      }

      & .payment__loading-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(13, 126, 232, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
    }

    & .payment__choose-type {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    & .payment-types {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 1rem;

      & svg {
        margin-right: 6px;
      }

      & .ssl {
        justify-self: flex-end;
        margin-top: -5px;
        margin-left: auto;
        margin-right: 1rem;
      }
    }

    & .payment__input {
      position: relative;

      & > iframe {
        width: 100% !important;
        max-height: 60px !important;
      }

      & input,
      & input:-webkit-autofill,
      & select {
        height: 40px;
        width: 100%;
        color: #000 !important;
        border: 1px solid #5A5A5A;
        border-radius: 5px;
        margin-bottom: 1.2rem;
        text-align: left;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 400;
        font-family: Arial;

        &:focus {
          border: 2px solid #5A5A5A;
          outline: none;
        }

        &::placeholder {
          color: #707070;
        }
      }
      & input:-webkit-autofill {
        -webkit-text-fill-color: #4D4D4D !important;
      }

      &.card-type::after {
        content: '';
        display: block;
        position: absolute;
        height: 0.8em;
        width: 0.8em;
        top: 50%;
        right: 1.125em;
        margin-top: -1.2em;
        z-index: 4;
        pointer-events: none;
        border: 1px solid #4D4D4D;
        border-radius: 2px;
        border-right: 0;
        border-top: 0;
        transform: rotate(-45deg);
        transform-origin: center;
      }

      & select {
        cursor: pointer;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        &::-ms-expand {
          display: none;
        }
      }
    }

    & .payment__actions {
      & .button {
        width: 100%;
        height: 40px;
        min-height: 40px;
        font-size: 16px;
      }
    }

  }

  .payment__info {
    font-size: 10px;
    color: #595959;
    line-height: 1.5;
    margin-top: 1rem;
  }

  .modal-inner-scroll-outer {
    padding-top: 2rem;
  }

  .modal-error-icon {
    width: 30px;
    margin-bottom: 10px;
  }


  .modal-title {
    margin-bottom: 1rem;
    color: #fff;
    font-size: 28px;
  }

  @media (max-width: 767px) {
    .payment {
      margin-top: 50%;

      .get-premium {
        top: 9%;

        & .container {
          width: auto;
        }
      }
    }
    .modal-error-icon {
      width: 25px;
    }

    .modal-title {
      font-size: 18px;
    }
  }
</style>
