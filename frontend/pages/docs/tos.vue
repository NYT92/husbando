<script setup>
useHead({
  title: "Terms and guidelines",
  meta: [
    {
      name: "description",
      content: "Terms and guidelines for uploading image",
    },
  ],
});
</script>
<template>
  <VContainer fluid class="fill-height">
    <VRow
      no-gutters
      align="center"
      justify="center"
      class="fill-height flex-column mx-5"
    >
      <h1 id="tos">Terms and guidelines</h1>
      <v-col>
        <h2 id="upload_tos">Upload guidelines</h2>
        <p class="mb-2">
          When uploading an image, be sure to read our rules before uploading
          it.
        </p>
        <ul class="ml-8">
          <li>
            OBVIOUSLY DO NOT UPLOAD WAIFU IMAGE. (USE
            <a href="https://waifu.pics" target="_blank">waifu.pics</a>)
          </li>
          <li>Do not upload R-18 shota, illegal media, and R-18G (GORE)</li>
          <li>
            All images must be marked as NSFW if they contain as follows:
            <ul class="ml-5">
              <li>Naked body</li>
              <li>Sex-related</li>
              <li>Showing penis/asshole</li>
              <li>Lightsaber censor</li>
            </ul>
          </li>
          <li>You can only upload 12MB of images or gifs.</li>
          <li>
            If your art have been upload here without permission, send us the
            <a href="https://sendsubmission.nsdev.ml/f/husbandosub">REPORT!</a>
          </li>
          <li>
            You must include at least one tag when uploading. (If there is no
            tag that fit the image or gif, find an alternative or wait for us to
            include more tag)
          </li>
          <li>
            Report us any issue related to the website or the image that
            violated our rules.
          </li>
        </ul>
        <p class="mt-3">
          If you don't follows any of these rules, you might get your IP blocked
          by us from using our services (incl. API).
        </p>
        <v-divider class="my-10"></v-divider>
      </v-col>

      <v-col>
        <h2 id="api-guideline" class="mb-2">API Usage</h2>
        <v-table>
          <thead>
            <tr>
              <th>Routes</th>
              <th>Type</th>
              <th>Rate Limit</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/api/v1/husbando/list</td>
              <td>POST</td>
              <td>200 per min</td>
              <td></td>
            </tr>
            <tr>
              <td>/api/v1/husbando/list</td>
              <td>GET</td>
              <td>200 per min</td>
              <td></td>
            </tr>
            <tr>
              <td>/api/v1/husbando/:type/:tags</td>
              <td>GET</td>
              <td>200 per min</td>
              <td></td>
            </tr>
            <tr>
              <td>/api/v1/husbando/:id</td>
              <td>GET</td>
              <td>200 per min</td>
              <td></td>
            </tr>
            <tr>
              <td>/api/file/hdoupload</td>
              <td>POST</td>
              <td>20 per day</td>
              <td>
                Example code
                <a href="" target="_blank">here</a>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-divider class="my-10"></v-divider>
      </v-col>
      <v-col>
        <h2 id="term" class="my-4">Terms and services</h2>

        <h2>1. Terms</h2>

        <p>
          By accessing this Website, accessible from https://husbando.pics, you
          are agreeing to be bound by these Website Terms and Conditions of Use
          and agree that you are responsible for the agreement with any
          applicable local laws. If you disagree with any of these terms, you
          are prohibited from accessing this site. The materials contained in
          this Website are protected by copyright and trade mark law.
        </p>

        <h2>2. Use License</h2>

        <p>
          Permission is granted to temporarily download one copy of the
          materials on husbando.pics's Website for personal, non-commercial
          transitory viewing only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>

        <ul class="ml-10">
          <li>modify or copy the materials;</li>
          <li>
            use the materials for any commercial purpose or for any public
            display;
          </li>
          <li>
            attempt to reverse engineer any software contained on
            husbando.pics's Website;
          </li>
          <li>
            remove any copyright or other proprietary notations from the
            materials; or
          </li>
          <li>
            transferring the materials to another person or "mirror" the
            materials on any other server.
          </li>
        </ul>

        <p>
          This will let husbando.pics to terminate upon violations of any of
          these restrictions. Upon termination, your viewing right will also be
          terminated and you should destroy any downloaded materials in your
          possession whether it is printed or electronic format. These Terms of
          Service has been created with the help of the
          <a href="https://www.termsofservicegenerator.net"
            >Terms Of Service Generator</a
          >.
        </p>

        <h2>3. Disclaimer</h2>

        <p>
          All the materials on husbando.pics’s Website are provided "as is".
          husbando.pics makes no warranties, may it be expressed or implied,
          therefore negates all other warranties. Furthermore, husbando.pics
          does not make any representations concerning the accuracy or
          reliability of the use of the materials on its Website or otherwise
          relating to such materials or any sites linked to this Website.
        </p>

        <h2>4. Limitations</h2>

        <p>
          husbando.pics or its suppliers will not be hold accountable for any
          damages that will arise with the use or inability to use the materials
          on husbando.pics’s Website, even if husbando.pics or an authorize
          representative of this Website has been notified, orally or written,
          of the possibility of such damage. Some jurisdiction does not allow
          limitations on implied warranties or limitations of liability for
          incidental damages, these limitations may not apply to you.
        </p>

        <h2>5. Revisions and Errata</h2>

        <p>
          The materials appearing on husbando.pics’s Website may include
          technical, typographical, or photographic errors. husbando.pics will
          not promise that any of the materials in this Website are accurate,
          complete, or current. husbando.pics may change the materials contained
          on its Website at any time without notice. husbando.pics does not make
          any commitment to update the materials.
        </p>

        <h2>6. Links</h2>

        <p>
          husbando.pics has not reviewed all of the sites linked to its Website
          and is not responsible for the contents of any such linked site. The
          presence of any link does not imply endorsement by husbando.pics of
          the site. The use of any linked website is at the user’s own risk.
        </p>

        <h2>7. Site Terms of Use Modifications</h2>

        <p>
          husbando.pics may revise these Terms of Use for its Website at any
          time without prior notice. By using this Website, you are agreeing to
          be bound by the current version of these Terms and Conditions of Use.
        </p>

        <h2>8. Your Privacy</h2>

        <p>Please read our Privacy Policy.</p>

        <h2>9. Governing Law</h2>

        <p>
          Any claim related to husbando.pics's Website shall be governed by the
          laws of kh without regards to its conflict of law provisions.
        </p>
      </v-col>
    </VRow>
  </VContainer>
</template>
