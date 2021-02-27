"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="far fa-star hidden"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  $(".far").show();
  checkForFavorites()
  
}


async function submitNewStory() {
  const $authorInput = $("#author").val();
  const $titleInput = $("#title").val();
  const $urlInput = $("#storyUrl").val();
  let storyObj = {
    author: $authorInput,
    title: $titleInput,
    url: $urlInput
  }
  console.log(storyObj);
  await storyList.addStory(currentUser, storyObj);
  putStoriesOnPage();
}

 $storyForm.on("submit", async function(e){
  e.preventDefault();
  await submitNewStory();
  $storyForm.trigger("reset");
  $storyForm.hide();
 });


 $('#all-stories-list').on('click', 'i', async function(e) {
  //  e.preventDefault()
  const faveId = $(e.target).parent().attr('id')
  const storyArr = storyList.stories
  let currentStory;
  for (let story of storyArr){
    if (faveId === story.storyId) {
      currentStory = story;
    }
  }
  if(!($(e.target).hasClass('icon-color-red'))) {
      await currentUser.addFavorites(currentStory)
    } else {
      await currentUser.deleteFavorite(currentStory)
    }
  $(e.target).toggleClass('icon-color-red')
})


$navFaves.on('click', function(e) {
  e.preventDefault()
  let storyArr = storyList.stories;
  for (let story of storyArr) {
    if(story.favorite === false) {
      $(`#${story.storyId}`).hide()
    }
  }
})

$navMySubmits.on('click', function(e) {
  e.preventDefault()
  let storyArr = storyList.stories;
  for (let story of storyArr) {
    if(story.username !== currentUser.username) {
      $(`#${story.storyId}`).hide()
    }
  }
})
