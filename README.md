# Running Cipher Decryptor

You can clone the source code and run the web app or go to https://runningkeydecryptor.web.app/ to run it on the web directly.

The way the web app works goes as follows. The ciphertext is already loaded in, and there is a field to enter a guess for a potential part of the key. You can then do one of two things.

1. You can enter the word you guessed and slide the slider or press < or > on the keyboard to go through each position in the ciphertext and decrypt small sections of it, and when you find something that you think is a word, click on the green rectangle to save it below. OR

2. Type in the guess and watch the suggestions that are populated below. They are ranked in terms of their score, which is calculated based on how many words are found in that section of the text or how closely it resembles english text. When you find something that you think is a match, click on it to save it below.

The way the web app knows about the words is by looking it up in a dictionary. Upon loading the web app, a dictionary json is loaded, read and then each word in it is inserted into a trie data structure, which has really good performance when looking up words.

The web app has a central functionality that lets it export and import a json file. The json file you export can be imported on another computer to load the progress in decrypting the crypt text. To load up and see how much of the crypttext we have decrypted, take the JSON file in the repo (exported.json to see what intermediate steps look like and "final json.json" to see the final result) and import it into the app. "Exported.json" shows what our progress looked like before we had enough info to search on google. "Final json.json" shows the final result. It should populate the necessary data. The web app also saves progress in memory to be reloaded when the app is reopened.

Fully Decrypted Key and Text

- Plain text:
helayflatonthebrownpineneedleflooroftheforesthischinonhisfoldedarmsandhighoverheadthewindblewinthetopsofthepinetreesthemountainsideslopedgentlywherehelaybutbelowitwassteepandhecouldseethedarkoftheoiledroadwindingthroughthepasstherewasastreamalongsidetheroadandfardownthepasshesawamillbesidethestreamandthefallingwaterofthedamwhiteinthesummersunlightisthatthemillheaskedyesidonotrememberititwasbuiltsinceyouwereheretheoldmillisfartherdownmuchbelowthepasshespreadthephotostatedmilitarymapoutontheforestfloorandlookedatitcarefullytheoldmanlookedoverhisshoulderhewasashortandsolidoldmaninablackpeasantssmockandgrayironstifftrousersandheworeropesoledshoeshewasbreathingheavilyfromtheclimbandhishandrestedononeofthetwoheavypackstheyhadbeencarryingthenyoucannotseethebridgefromherenotheoldmansaidthisistheeasycountryofthepasswherethestreamflowsgentlybelowwheretheroadturnsoutofsightinthetreesitdropssuddenlyandthereisasteepgorgeirememberacrossthegorgeisthebridgeandwherearetheirpoststhereisapostatthemillthatyouseethere
- Key
incryptographyencryptionistheprocessofencodinginformationthisprocessconvertstheoriginalrepresentationoftheinformationknownasplaintextintoanalternativeformknownasciphertextideallyonlyauthorizedpartiescandecipheraciphertextbacktoplaintextandaccesstheoriginalinformationencryptiondoesnotitselfpreventinterferencebutdeniestheintelligiblecontenttoawouldbeinterceptorfortechnicalreasonsanencryptionschemeusuallyusesapseudorandomencryptionkeygeneratedbyanalgorithmitispossibletodecryptthemessagewithoutpossessingthekeybutforawelldesignedencryptionschemeconsiderablecomputationalresourcesandskillsarerequiredanauthormzedrecipientcaneasilydecryptthemessagewiththekeyprovidedbytheoriginatortorecipientsbutnottounauthorizedusershistoricallyvariousformsofencryptionhavebeenusedtoaidincryptographyearlyencryptiontechniqueswereoftenusedinmilitarymessagingsincethennewtechniqueshaveemergedandbecomecommonplaceinallareasofmoderncomputingmodernencryptionschemesusetheconceptsofpublickeyandsymmetrickeymodernencryptiontechniquesen
