<template>
  <q-page class="relative-postion">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            class="new-qweet"
            v-model="newQweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            :dense="dense"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent"
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Qweet"
            no-caps
          />
        </div>
      </div>
      <q-separator
        class="divider"
        size="10px"
        color="grey-2"
      />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="qweet in qweets"
            :key="qweet.id"
            class="qweet q-py-md"
            >
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Vi Ho</strong>
                <span class="text-grey-7">
                @manizha_salomova
                <br class="lt-md">&bull; {{qweet.date | relativeDate}}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                  {{qweet.content}}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                flat
                round
                color="grey"
                icon="far fa-comment"
                size="sm"
                />
                <q-btn
                flat
                round
                color="grey"
                icon="fas fa-retweet"
                size="sm"
                />
                <q-btn
                @click="toggleLiked(qweet)"
                flat
                round
                :color="qweet.liked ? 'pink' : 'gray'"
                :icon="qweet.liked ? 'fas  fa-heart' : 'far fa-heart'"
                size="sm"
                />
                <q-btn
                @click="deleteQweet(qweet)"
                flat
                round
                color="grey"
                icon="fas fa-trash"
                size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
          </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'
export default {
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [
                //  {
                //    id: 'ID1',
                //    content:  'There are two primary choices in life: to accept conditions as they exist, or accept the responsibility for changing them',
                //    date: 1635627999211,
                //    liked: false

                // },
                //  {
                //    id: 'ID2',
                //    content:  'Aerodynamically the bumblebee shouldnt be able to fly but the bumblebee doesnt know that so it goes on flying anyway',
                //    date: 1635628100512,
                //    liked: true
                // },
              ]

    }
  },
  methods:{
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      }
      //this.qweets.unshift(newQweet)
       db.collection('qweets').add(newQweet).then((docRef) => {
          console.log('Document written with ID: ', docRef.id)
        }).catch((error) => {
          console.error('Error adding document: ', error)
        })
        this.newQweetContent = ''
    },
    deleteQweet(qweet){
      db.collection('qweets').doc(qweet.id).delete().then(function() {
          console.log('Document successfuly deleted!')
        }).catch((error) => {
          console.error('Error removing document: ', error)
        })
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        liked: !qweet.liked
      })
      .then(function() {
        console.log('Document successfully update!')
      })
      .catch(function(error) {
        console.error('Error updating document: ', error)
      })
    }
  },
  filters: {
    relativeDate(value){
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            let qweetChange = change.doc.data()
            qweetChange.id = change.doc.id
              if (change.type === 'added') {
                console.log('New qweet: ', qweetChange)
                this.qweets.unshift(qweetChange)
              }
              if (change.type === 'modified') {
                console.log('Modified qweet: ', qweetChange)
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                Object.assign(this.qweets[index], qweetChange)
              }
              if (change.type === 'removed') {
                console.log('Removed qweet: ', qweetChange)
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                this.qweets.splice(index, 1)
              }
          })
    })
  }
}
</script>

<style lang ="sass">
  .divider
    border-top: 1px solid
    border-bottom: 1px solid
    border-color: grey-4

  .new-qweet
    textarea
      font-size: 19px
      line-height: 1.4 !important
      border-color: grey-4
  .qweet-content
    white-space: pre-line
  .qweet-icons
    margin-left: -5px

  .qweet:not(:first-child)
   border-top: 1px solid rgba(0, 0 , 0, 0.12)
</style>
