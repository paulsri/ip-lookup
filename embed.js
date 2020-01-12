<script type="text/javascript">
  const url = 'https://api.ipify.org?format=json';

  var ip = fetch(url)
    .then(res => res.json())
    .then((json) => {
      console.log(json.ip);
      return json.ip;
    })
    .then(function(ip) {
      const pushoverUrl = "https://<your_host>.execute-api.us-east-1.amazonaws.com/default/pushover?ip=" + ip;
      console.log("pushoverUrl: " + pushoverUrl);
      fetch(pushoverUrl)
        .then (res => res.json())
        .then((json) => {
          console.log(json);
        })
    })
</script>
