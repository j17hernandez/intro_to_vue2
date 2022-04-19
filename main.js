const eventBus = new Vue()
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  template: `
  <div class="product">
  <div class="product-image">
    <img v-bind:src="image" alt="" srcset="" />
  </div>
  <div class="product-info">
    <h1>{{ title }}</h1>
    <p v-if="inStock">In Stock</p>
    <p class="out-of-stock" v-else>Out of Stock</p>
    <p> {{ sale }} </p>
    <p> Shipping {{ shipping }} </p>
    <h2>Features</h2>
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
    <div v-if="false">
      <h2>Sizes</h2>
      <ul>
        <li v-for="size in sizes">{{ size }}</li>
      </ul>
    </div>

    <div
      v-for="(variant, index) in variants"
      :key="variant.id"
      class="color-box"
      :style="{ backgroundColor: variant.color}"
      @mouseover="updateProduct(index)">
    </div>
    <button class="danger" @click="deleteCart">-</button>
    <button :disabled="!inStock" :class="{ primary: inStock, disabledButton: !inStock}" @click="addToCart">+</button>
  </div>

  <product-tabs :reviews="reviews"></product-tabs>

  </div>
  `,
  data() {
    return  {
      brand: 'Vue Mastery',
      product: "Socks",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          id: 2234,
          color: "green",
          image: './assets/vmSocks-green-onWhite.jpg',
          quantity: 10
        },
        {
          id: 2235,
          color: "blue",
          image: './assets/vmSocks-blue-onWhite.jpg',
          quantity: 0
        },
      ],
      isButtonDisabled: false,
      sizes: ["S", "M", "L", "XL"],
      isVisibleSize: false,
      onSale: true,
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart')
    },
    deleteCart() {
      this.$emit('delete-cart')
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand.concat(' ', this.product)
    },
    image() {
      return this.variants[this.selectedVariant].image
    },
    inStock() {
      return this.variants[this.selectedVariant].quantity
    },
    sale() {
      if (this.onSale) {
        return this.brand.concat(' ', this.product, 'are on sale!')
      } else {
        return this.brand.concat(' ', this.product, 'are not on sale!')
      }
    },
    shipping() {
      if (this.premium) {
        return 'Free'
      }
      return 2.99
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s)</b>
        <ul>
          <li v-for="error in errors">
            {{ error }}
          </li>
        </ul>
      </p>
      <p>
        <label>Name:</label>
        <input id="name" v-model="name" required>
      </p>
      <p>
        <label>Review:</label>
        <textarea id="review" v-model="review" required></textarea>
      </p>
      <p>
        <label>Rating:</label>
        <select id="rating" v-model.number="rating" required>
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        <label>¿Would you recommend this product? </label>
        <br><br>
        <input class="recomendation" type="checkbox" v-model="recomendation">
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recomendation: false,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recomendation: this.recomendation
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recomendation = null
      } else {
        if(!this.name) this.errors.push('Name is required.')
        if(!this.review) this.errors.push('review is required.')
        if(!this.rating) this.errors.push('rating is required.')
      }
    }
  }
})


Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      default: []
    }
  },
  template: `
  <div>
    <span
      class="tab"
      :class="{ activeTab : selectedTab === tab}"
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectedTab = tab"
    >
      {{ tab }}
    </span>

    <div v-show="selectedTab === 'Reviews'">
    <p v-if="!reviews.length">There are not reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>{{ review.review }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>Recommended: {{ review.recomendation}}</p>
        </li> 
      </ul>
    </div>
    
    <product-review v-show="selectedTab === 'Make a Review'" @review-submitted="addReview" />
  </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})
const app = new Vue({
  el: "#app",
  data() {
    return {
      premium: true,
      cart: 0,
    }
  },
  methods: {
    updateCart() {
      this.cart++
    },
    deleteCart() {
      if (this.cart > 0) {
        this.cart--
      }
    }
  }
});
