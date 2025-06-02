<template>
  <div class="user-chat-content">
    <div class="ctext-wrap">
      <div class="ctext-wrap-content">
        <form method="post" action="/form-submit">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              class="form-control"
              id="name"
              placeholder="Your Name"
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              name="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              name="message"
              class="form-control"
              id="message"
              rows="3"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
    <div class="conversation-name">
      KapyChat AI<small class="text-muted mb-0 ms-2">09:14am</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactUs",
};
</script>

<style scoped></style>
