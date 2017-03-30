# Sketch-ctrl

_a.k.a._ "Sketch Control"

## Rationale

Version control via user interface tool is a pain, to say the least. And while some apps offer us the promise of better futures —[InVision Sync](https://www.invisionapp.com/), [Abstract App](https://abstractapp.com) (the most promising for the time being), [Picnic](http://picnic.design/)… [Even Google Drive now let us to "manage versions"](https://support.google.com/drive/answer/2409045) of a given file (good on you if you're ever able to tell one version from the other apart from the sync date)— we're still bound to find complicated, self-contradictory file names to tell versions, major milestones or tweaks.

Sketch 43 and upwards sport a new file format, [which is basically a set of JSON data files, all zipped out together](http://sketchplugins.com/d/87-new-file-format-in-sketch-43) —You said JSON? Yes, JSON. And this file format is _quite interesting_ when considered within a git repository.

## Install

Until further notice, we'll stay close to the metal and just:

```sh
git clone https://github.com/Daylon/sketch-ctrl.git
```

## Usage

Here's the scenario: Alice forks this repo and make it hers. She starts by creating a new branch. Let's name it `for-my-client`. Alice opens up a terminal*:

```sh
cd ~/Documents/sketch-ctrl/
gulp
```

She starts building a nice a fancy user interface, then saves her work as `client-ui.sketch` at:

```sh
~/Documents/sketch-ctrl/sources/client-ui.sketch
```

This Gulp script then automatically unzip the source at `/sketch-ctrl/dist/`. Sketch sources are ignored by Git. And since we're dealing with, unpacked files are can now be staged with a proper commit and pushed on a remote.

Her colleague Bob can now retrieve _in realtime_ Alice's work, branch it out, merge, edit and commit to the same remote without destroying it. **Bonus:** Alice and Bob can now groom a clean shared history.

_*: well, yes, this is not a nice a friendly WYSIWYG, but I could be so, I think, with a bit more work.



## Available tasks

### Output all

```sh
gulp --tasks-simple
```

### Useful ones

#### 1. Gulp build-all

Given a set of fetched unzipped sketch files, it will zip them back and place them in the `sources` folder. Useful when you get your coworker's source file back.

#### 2. Gulp build --sketch {{filename}}

Given that we only want one specific file `{{filename}}.sketch`, it will only build back this one. No noise.

#### 3. Gulp unpack

Will simply unzip any `.sketch` file located in `/sources/`.

#### 4. Cleanup

If we're messing up:

- `Gulp cleanup-dist`: delete all unzipped sources;
- `Gulp cleanup-sources`: delete all `.sketch` source files.