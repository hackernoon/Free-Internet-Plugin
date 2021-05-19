
var admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          project_id: process.env.FIREBASE_PROJECT_ID
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    
  }
  



module.exports = async (req, res) => {
    const db = admin.firestore()
    var pluginTotalBlockedref = await db.collection("plugin-blocked-count").doc("counter")
    var pluginTotalBlocked
    var count;
    if (req.query.count) {
        count = parseInt(req.query.count)
        pluginTotalBlocked = (await pluginTotalBlockedref.get()).data().count + count
        pluginTotalBlockedref.set({"count": parseInt(pluginTotalBlocked)})
    }
    else {
        pluginTotalBlocked = (await pluginTotalBlockedref.get()).data().count
    }
    res.json({
        count: pluginTotalBlocked
    })
}