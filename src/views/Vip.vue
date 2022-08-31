<template>
  <div class="lobby__main-view" :class="{'is-loading': isLoading}">
    <div v-if="isLoading" class="area__loading area__loading--vip">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-if="(showForm && canUpgradeToVip)" class="lobby__vip-content content"> <!-- || (showForm && userLevel > 0 && activeSub.status === 'Cancelled') -->
      <div class="vip-col vip-col--left">
        <div class="vip-benefits-top">
          <h1 v-if="newSubscriber" class="vip-heading">Get 24 Hours Free</h1>
          <h1 v-else class="vip-heading">Membership</h1>
          <p class="vip-benefits-p" style="color: #fff;">Join the Tournament community and win REAL cash prizes!</p>
          <div class="upgrade-options" v-if="showVariants">
            <div class="upgrade-option" @click="selectedVariantId = 2" :class="{ 'active' : selectedVariantId === 2 }">
              <div class="upgrade-option-top">
                <Badge text="Founders discount" variant="vip" />
                <img src="@/assets/games/hilo1.jpg" alt="hilo">
              </div>
              <div class="upgrade-option-bottom">
                <h2>$16.59 / month</h2>
                <p>Billed annually</p>
                <Button text="Select" variant="orange" @clicked="selectedVariantId = 2" />
              </div>
            </div>
            <div class="upgrade-option" @click="selectedVariantId = 1" :class="{ 'active' : selectedVariantId === 1 }">
              <div class="upgrade-option-top">
                <img src="@/assets/games/hilo1.jpg" alt="hilo">
              </div>
              <div class="upgrade-option-bottom">
                <h2>$29.99 / month</h2>
                <p>Billed monthly</p>
                <Button text="Select" variant="orange" @clicked="selectedVariantId = 1" />
              </div>
            </div>
          </div>
        </div>
        <div class="vip-benefits">
          <!-- <h4 class="vip-other-heading">You will get</h4> -->
          <p v-for="(benefit, index) in benefits" v-html="benefit" :key="`benefit-${index}`"></p>
        </div>
      </div>
      <div v-if="$store.state.vip.vipActive" class="vip-col vip-col--right">
        <h6 class="vip-other-heading">Set up your credit or debit card</h6>
        <form id='chargify-form' @submit="submitChargify">
          <div v-if="paymentMethod" class="choose-method">
            <div class="method-option method-option--default" :class="{ active : defaultMethodSelected }" @click="defaultMethodSelected = true;">
              <div class="check-a"></div>
              {{ paymentMethod.cardType }} &bull;&bull;&bull;&bull; {{ paymentMethod.lastFour }} <small>Expires {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear }}</small>
            </div>
            <div class="method-option method-option--new" :class="{ active : !defaultMethodSelected }" @click="defaultMethodSelected = false;">
              <div class="check-a"></div>
              Add New Payment Method
            </div>
          </div>
          <template v-if="!defaultMethodSelected">
            <div class="vip-billing-details-form">
              <input type="text" v-model="firstName" class="vip-input vip-input--row" placeholder="First Name" data-recurly="first_name">
              <input type="text" v-model="lastName" class="vip-input vip-input--row" placeholder="Last Name" data-recurly="last_name">
              <div class="chargify-element">
                <div id="chargify1" ref="chargifyelements1">
                  <!-- Chargify elements will be attached here CARD NUMBER -->
                </div>
                <div id="chargify2" ref="chargifyelements2">
                  <!-- Chargify elements will be attached here MONTH -->
                </div>
                <div id="chargify3" ref="chargifyelements3">
                  <!-- Chargify elements will be attached here YEAR -->
                </div>
                <div id="chargify4" ref="chargifyelements4">
                  <!-- Chargify elements will be attached here CVV -->
                </div>
                <div class="host-field">
                  <input type="hidden" class="host-input" data-chargify="country" :value="country"/>
                </div>
              </div>
              <div class="chargify-element">
                <div id="chargify5" ref="chargifyelements5">
                  <!-- Chargify elements will be attached here ZIP -->
                </div>
              </div>
              <div class="chargify-element">
                <div class="acc-input-wrap acc-input-wrap--hasselect">
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
            <ul v-if="recurlyErrors.length" class="errors">
              <li v-for="(error, index) in recurlyErrors" :key="`error-${index}`">{{ error.field }} - {{ error.message }}</li>
            </ul>
          </template>
          <!-- <h4 class="vip-other-heading">Total</h4> -->
          <div v-if="selectedVariantId === 2" class="vip-basket">
            <p class="vip-basket__product">One year Member subscription: <span class="vip-price vip-price__crossed">$299.99</span></p>
            <p class="vip-basket__product vip-basket__product--offer">- Founding Member price <span class="vip-price">$199</span></p>
          </div>
          <div v-else class="vip-basket">
            <p class="vip-basket__product" v-if="newSubscriber">I understand my payment method will be debited for the amount of $29.99 after 24 hours and each month thereafter if I choose not to cancel my membership.</p>
            <p class="vip-basket__product" v-else>I understand my payment method will be debited for the amount of $29.99 now and each month thereafter if I choose not to cancel my membership.</p>
          </div>
          <div class="vip-checkout">
            <div v-if="selectedVariantId === 2" class="vip-checkout__button">
              <Button text="Start Membership" variant="green"/>
            </div>
            <div v-else class="vip-checkout__button">
              <Button text="Start Membership" variant="green"/>
            </div>
            <input id="chargify-token" type="hidden" />
            <div class="vip-checkout__terms">
              <p>All payments are secure under 256-bit SSL encryption across all services.</p>
              <p>You can modify or cancel your subscription at any moment from your profile page. For more information please read our <router-link :to="{ name: 'TermsConditions' }">Terms &amp; Conditions</router-link>.</p>
            </div>
          </div>
        </form>
        <div class="vip-payment-icons">
          <img svg-inline class="p-icon p-icon--master-card" src="@/assets/cc/master-card.svg" alt="master-card" />
          <img svg-inline class="p-icon p-icon--visa" src="@/assets/cc/visa.svg" alt="visa" />
          <img svg-inline class="p-icon p-icon--amex" src="@/assets/cc/amex.svg" alt="amex" />
        </div>
      </div>
    </div>
    <div class="lobby__footer">
      <div class="vip-disclaimer">
        <p>The website www.tournament.com is owned and operated by Tournament Entertainment Limited, 77 Sir John Rogersons’s Quay, Dublin 2, Ireland DO2 F540</p>
      </div>
    </div>
    <Modal
      v-model="showConfirmModal"
      title="Welcome on board!"
      btn-text="Continue"
      btn-variant="rounded-blue"
      :btn-action="afterNewSubscription"
      mode="jackpot"
    >
      <template v-slot:body>
        Thank you for becoming a new member of Tournament. Let's hope you're our next big winner!
      </template>
    </Modal>
  </div>
</template>

<script>
import Badge from '@/components/global/Badge.vue';
import Button from '@/components/global/Button.vue';
import Modal from '@/components/global/Modal.vue';

export default {
  name: 'Vip',
  components: {
    Badge,
    Button,
    Modal,
  },
  data() {
    return {
      showConfirmModal: false,
      games: [
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
      ],
      showForm: true,
      recurlyElements: null,
      firstName: '',
      lastName: '',
      country: '',
      token: '',
      isLoading: false,
      // activeSub: null,
      recurlyErrors: [],
      chargify: null,
      paymentMethod: null,
      defaultMethodSelected: null,
      selectedVariantId: 1,
      showVariants: false,
    };
  },
  watch: {
    defaultMethodSelected(val) {
      if (val === false) {
        setTimeout(() => this.mountChargify(), 150);
      } else {
        this.destroyChargify();
      }
    },
    activeSub(val) {
      if (val && val.status !== 'Expired') {
        this.$router.push({ name: 'Profile' });
      }
    },
  },
  computed: {
    userLevel() {
      return this.$store.getters.userLevel;
    },
    activeSub() {
      return this.$store.state.vip.subscription;
    },
    canUpgradeToVip() {
      return this.$store.getters.canUpgradeToVip;
    },
    benefits() {
      return this.$store.getters.benefits;
    },
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
    // this.$api.get('/upgrade/subscription/tier')
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    this.$api.get('/payment/method')
      .then((response) => {
        this.paymentMethod = response.data;
        this.defaultMethodSelected = true;
      })
      .catch((error) => {
        this.defaultMethodSelected = false;
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
        console.log(this.userData);
        if (typeof this.userData.country !== 'undefined' && this.userData.country) {
          this.country = this.userData.country;
        }
      });
    this.fetchCurrentSub();
  },
  mounted() {
    //
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
      this.chargify.load({
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
          },
          year: {
            selector: '#chargify3',
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
          '#chargify1': {
            backgroundColor: 'transparent',
          },
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
            backgroundColor: 'transparent',
            border: '0',
            paddingTop: '2px',
            paddingBottom: '1px',
            placeholder: { color: '#A2A2CD' },
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            padding: '.75rem',
            lineHeight: '1',
          },
        },
      });
    },
    fetchCurrentSub() {
      this.isLoading = true;
      this.$store.dispatch('loadSubscription')
        .finally(() => {
          this.isLoading = false;
        });
    },
    cancelSub() {
      this.isLoading = true;
      this.$api.put('/upgrade/subscription', {
        tierId: 0,
      })
        .then(() => {
          this.isLoading = false;
          this.$noty.success('Your Subscription Has Been Canceled');
          this.fetchCurrentSub();
        })
        .catch((err) => {
          this.isLoading = false;
          if (err.response) {
            this.$noty.error(err.response.data.message);
          }
        });
    },
    submitChargify(e) {
      e.preventDefault();
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.recurlyErrors = [];
      if (this.defaultMethodSelected) {
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
              this.createNewSubscription();
            })
            .catch((error) => {
              console.error(error);
              this.isLoading = false;
            });
        },
        (err) => {
          console.log('token ERROR - err: ', err);
          if (err.message) {
            this.$noty.error(err.message);
          } else if (err.errors) {
            this.$noty.error(typeof err.errors === 'string' ? err.errors : err.errors[0]);
          }
          this.isLoading = false;
        },
      );
    },
    createNewSubscription() {
      this.isLoading = true;
      this.$api.post('/upgrade/subscription/1', {
        variantId: this.selectedVariantId,
      })
        .then(() => {
          this.showConfirmModal = true;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    afterNewSubscription() {
      this.fetchCurrentSub();
      this.$store.dispatch('loadUserData');
      this.showForm = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .vip-heading {
    font-weight: 700;
    background: $orange-gradient;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .lobby__footer {
    margin-top: auto;
  }
  .lobby__vip-content {
    padding: 6rem 2rem;
    color: $kimberly;
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
  }
  .vip-games-slider {
    display: flex;
    justify-content: center;
    align-items: center;
    .slider-item {
      margin: 0 .5rem;
      /deep/ h2 {
        font-size: 1rem;
      }
    }
  }
  .vip-col--left {
    flex-basis: 60%;
    padding-right: 4rem;
    @media (min-width: 1600px) {
      &:last-of-type {
        flex-basis: 100%;
        padding-right: 0;
        display: flex;
        align-items: center;
      }
    }
  }
  .vip-benefits {
    margin-top: 2rem;
    p {
      line-height: 1.5;
      margin-bottom: .25rem !important;
    }
  }
  .vip-other-heading {
    color: #fff;
  }
  .vip-col--right {
    flex: 1;
    position: relative;
  }
  .vip-col--bottom {
    font-size: 14px;
    margin-top: 2rem;
  }
  .vip-benefits-p,
  .vip-benefits p,
  .vip-basket__product,
  .vip-checkout__terms {
    font-size: 14px;
  }
  .vip-input {
    font-size: 12px;
    font-weight: 600;
    padding: .75rem;
    width: 100%;
    background-color: $light-navy;
    color: #fff;
    border-radius: 0 !important;
    &::placeholder {
      color: $kimberly;
      font-weight: 500;
    }
  }
  .vip-input--row:not(:last-child) {
    margin-bottom: .5rem;
  }
  .vip-input-grp {
    display: flex;
    justify-content: space-between;
    .vip-input {
      flex-basis: calc(50% - .25rem);
    }
  }
  /deep/ .recurly-element {
    border: 0;
    background-color: $light-navy;
    color: $kimberly;
    border-radius: 0 !important;
    margin-bottom: .5rem;
    height: 38px;
  }
  /deep/ .chargify-element {
    border: 0;
    background-color: $light-navy;
    color: $kimberly;
    border-radius: 0 !important;
    margin-bottom: .5rem;
    height: 38px;
    display: flex;
    width: 100%;
    max-width: 100%;
  }
  /deep/ #chargify1 iframe,
  /deep/ #chargify2 iframe,
  /deep/ #chargify3 iframe,
  /deep/ #chargify4 iframe,
  /deep/ #chargify5 iframe {
    width: 100% !important;
    height: 38px !important;
  }
  #chargify1 {
    flex: 5;
  }
  #chargify2 {
    flex: 1;
    min-width: 45px;
    max-width: 50px;
  }
  #chargify3 {
    flex: 1;
    min-width: 58px;
  }
  #chargify4 {
    flex: 1;
    min-width: 50px;
  }
  select.acc-input.acc-input--editable.is-placeholder {
    color: $kimberly;
    font-weight: 500;
  }
  select.acc-input {
    cursor: pointer;
    display: block;
    max-width: 100%;
    outline: 0;
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background-color: $light-navy;
    color: #fff;
    height: 100%;
    padding: .75rem;
    font-size: 12px;
    font-weight: 600;
    flex: 1;
  }
  .acc-input-wrap--hasselect {
    position: relative;
    display: flex;
    flex: 1;
    &::after {
      right: 1.125em;
      z-index: 4;
      border: 3px solid $kimberly;
      border-radius: 2px;
      border-right: 0;
      border-top: 0;
      content: " ";
      display: block;
      height: .625em;
      margin-top: -.4375em;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: rotate(-45deg);
      transform-origin: center;
      width: .625em;
    }
  }
  .method-option {
    background: #232338;
    margin-bottom: .5rem;
    font-size: 12px;
    cursor: pointer;
    line-height: 1;
    padding: .75rem;
    padding-left: 2.1rem;
    position: relative;
    transition: color .25s linear;

    &:hover {
      background: #212142;
      color: #aaaadc;
      .check-a {
        border-color: #aaaadc;
      }
    }
    &.active {
      color: #fff;
      font-weight: 600;
      .check-a {
        border-color: #fff;
      }
      .check-a::before{
        background: #fff;
      }
    }
    .check-a {
      display: block;
      position: absolute;
      border: 3px solid #7474AD;
      border-radius: 100%;
      height: 14px;
      width: 14px;
      top: 10px;
      left: 10px;
      z-index: 5;
      transition: border .25s linear;
    }
    .check-a::before {
      display: block;
      position: absolute;
      content: '';
      border-radius: 100%;
      height: 3.5px;
      width: 3.5px;
      top: 2px;
      left: 2px;
      margin: auto;
      transition: background 0.25s linear;
    }
  }
  .choose-method {
    margin-bottom: 1rem;
  }
  .vip-billing-details-form {
    margin-bottom: 2rem;
  }
  .vip-basket {
    line-height: 1.4;
    .vip-basket__product {
      display: flex;
      justify-content: space-between;
      margin-bottom: .5rem !important;
    }
    .vip-basket__product--offer {
      color: #fff;
    }
  }
  .vip-price {
    margin-left: 1rem;
  }
  .vip-price__crossed {
    text-decoration: line-through;
  }
  .vip-checkout__terms {
    line-height: 1.5;
    a {
      color: #fff;
    }
  }
  .vip-checkout {
    margin-top: 2rem;
  }
  .vip-checkout__button {
    display: flex;
    margin-bottom: 2rem;
  }
  .vip-payment-icons {
    display: flex;
    align-items: center;
  }
  .p-icon {
    width: 50px;
  }
  .p-icon:not(:last-child) {
    margin-right: 1rem;
  }
  .vip-payment-icons {
    position: absolute;
    right: 0;
    top: -4px;
  }
  .is-loading .lobby__vip-content {
    pointer-events: none;
    opacity: 0.3;
  }
  .area__loading.area__loading--vip {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .vip-disclaimer {
    color: $kimberly;
    font-size: 12px;
    margin-bottom: 1rem;
    text-align: center;
    padding: 0 1.5rem;
  }
  // UPGRADE OPTIONS - TODO: move to component
  .upgrade-options {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -.5rem;
    margin-right: -.5rem;
  }
  .upgrade-option {
    margin: .5rem;
    border: 2px solid transparent;
    transition: box-shadow 0.15s ease-in-out, border 0.25s ease-in-out;

    img {
      -o-object-fit: cover;
      object-fit: cover;
      width: 100%;
      height: 100%;
      display: block;
    }
    h2 {
      font-size: 1rem;
      margin: 0 0 .5rem;
      color: #fff;
      line-height: 1.125;
    }
    p {
      margin: 0;
      font-size: 12px;
      font-weight: bold;
      line-height: 1.5;
      color: $kimberly;
    }
    .button {
      margin-top: 10px;
      display: block;
      width: 100%;
    }
    &.active {
      border: 2px solid #fe8142;
      box-shadow: 0px 0px 10px #b75829;
      pointer-events: none;

      .button {
        pointer-events: none;

        &::after {
          left: calc(50% - 4px);
          top: calc(50% - 10px);
          width: 8px;
          height: 16px;
          border: solid white;
          border-width: 0 3px 3px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
          position: absolute;
          content: '';
        }
        /deep/ .button__text {
          opacity: 0;
        }
      }
    }
    &:not(.active) {
      transform: scale(0.95);
    }
  }
  .upgrade-option-top {
    position: relative;
    height: 80px;

    .badge {
      position: absolute;
      top: .5rem;
      left: .5rem;
      font-size: 10px;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  .upgrade-option-bottom {
    background-color: #232338;
    padding: 1rem;
  }

  @media (min-width: 1600px) {
    .vip-payment-icons[data-v-533ef15a] {
      top: -50px;
    }
  }

  @media (min-width: 1440px) {
    .slider-item {
      &:nth-child(1),
      &:nth-child(2) {
        display: none;
      }
      &:nth-child(4) {
        opacity: .5;
        transform: scale(0.85);
        left: -13px;
      }
      &:nth-child(5){
        transform: scale(0.7);
        opacity: 0.2;
        left: -3.75rem;
      }
    }
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    .slider-item {
      &:last-child {
        display: none;
      }
    }
  }
  @media (max-width: 1599px) {
    .lobby__vip-content {
      flex-wrap: wrap;
      padding: 2rem;
      margin-bottom: 1rem;
    }
    .vip-col--left {
      flex-basis: 100%;
      padding-right: 0;
      display: flex;
      align-items: center;
    }
    .vip-benefits-top {
      flex-basis: 70%;
      padding-right: 1rem;
    }
    .vip-benefits {
      margin-top: 0;
    }
    .vip-col.vip-col--right {
      margin-top: 2rem;
    }
  }
  @media (max-width: 1439px) {
    .vip-col--left {
      flex-wrap: wrap;
    }
    .vip-benefits-top {
      flex-basis: 100%;
      padding-right: 0;
    }
    .vip-benefits {
      width: 100%;
      margin-top: 1rem !important;
    }
    .slider-item {
      &:not(:nth-child(3)) {
        opacity: 0.3;
      }
      &:nth-child(2), &:nth-child(4) {
        transform: scale(0.85);
      }
      &:nth-child(1), &:nth-child(5) {
        display: none;
      }
      &:nth-child(2) {
        right: -13px;
      }
      &:nth-child(4) {
        left: -13px;
      }
    }
  }
  @media (max-width: 1279px) {
    .panel {
      display: flex;
      flex-direction: column;
    }
    .lobby__main-view {
      padding: 1rem 0;
    }
    .mobile-nav {
      order: 1;
    }
    .col-right {
      order: 2;
    }
    .col-left {
      order: 3;
    }
    .col-middle {
      order: 4;
    }
  }
  @media (max-width: 767px) {
    /deep/ .winner__timeago {
      display: none;
    }
    .lobby__vip-content {
      padding: 0;
    }
    .lobby__vip-content,
    .vip-col--left {
      display: block;
    }
    .vip-games-slider {
      width: 150vw;
      position: relative;
      left: calc(-50% + (50vw / 2));
    }
    .vip-games-slider-outer {
      overflow: hidden;
      margin-left: -1rem;
      margin-right: -1rem;
    }
    .slider-item {
      &:not(:nth-child(3)) {
        opacity: 0.3;
      }
      &:nth-child(2), &:nth-child(4){
        transform: scale(0.85);
      }
      &:nth-child(1), &:nth-child(5){
        transform: scale(0.7);
        opacity: 0.2;
      }
      &:nth-child(2) {
        right: -13px;
      }
      &:nth-child(4) {
        left: -13px;
      }
      &:nth-child(1) {
        right: -3.75rem;
      }
      &:nth-child(5) {
        left: -3.75rem;
      }
    }
    .vip-heading {
      text-align: center;
    }
    .vip-benefits-p {
      text-align: center;
    }
    .vip-benefits-p,
    .vip-benefits p,
    .vip-basket__product,
    .vip-checkout__terms {
      font-size: 12px;
    }
    .vip-payment-icons {
      top: -2px;
    }
    .p-icon {
      width: 35px;
    }
    .p-icon:not(:last-child) {
      margin-right: .3rem;
    }
    .vip-disclaimer {
      text-align: left;
      padding: 0;
    }
    .vip-benefits {
      width: 100%;
      margin-top: 1rem !important;
    }
    .vip-col.vip-col--right {
      margin-top: 1.5rem;
    }
    .vip-billing-details-form {
      margin-bottom: 1.5rem;
    }
    .vip-checkout {
      margin-top: 1.5rem;
    }
    .vip-checkout__button {
      margin-bottom: 1.5rem;
    }
    .vip-benefits p {
      font-size: 11px !important;
    }
  }
  @media (max-width: 500px) {
    h6.vip-other-heading {
      font-size: 14px;
    }
    .p-icon {
      width: 30px;
    }
    .p-icon:not(:last-child) {
      margin-right: .2rem;
    }
  }
  @media (max-width: 374px) {
    h6.vip-other-heading {
      font-size: 12px;
    }
  }
</style>
