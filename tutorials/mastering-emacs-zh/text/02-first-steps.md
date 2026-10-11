# 上手：安装、界面、按键、配置

> 原书来源：Mastering Emacs (Eli Spare)，第 38–84 页。
> 覆盖范围：First Steps

## [p.38]
Chapter 3
First Steps
I use Emacs, which might be thought of as a ther-
monuclear word processor.
– Neal Stephenson, In the Beginning… was the
Command Line.
Installing and Starting Emacs
Before I get into the nitty-gritty of installing Emacs, you
should check and see if it’s installed already. However, you
have to be extra vigilant if it is: it might be an ancient version.
Checking Emacs’s version
You can check Emacs’s version by typing emacs
--version.
As of this 2024 release of the book, the newest major version
is GNU Emacs 29. I recommendyou adopt the latestversion as
38

## [p.39]
First Steps
soon as time permits. You should try to stay current: major
releases in Emacs are infrequent enough that keeping abreast
shouldn’t trouble you much. If you do upgrade, it’s rarely
for the bug fixes (because Emacs is actually extremely stable)
but for the features and the fact that most package authors
assume you’re using the latest version. (Having said that, if
you’re on a very obscure platform it may not be possible for
you to upgrade at all.)
A hallmark of Emacs is its long held belief that breaking com-
patibility should take multiple major releases from depreca-
tion to removal. Uncommonly, complaints stream into the
Emacs mailing lists that a piece of code they wrote in the late
1980s suddenly broke because the Emacs maintainers finally
removed a long-obsoleted variable or function.
Emacs supports most major platforms you are likely to use
yourself: BSD and Linux, Mac OSX, MS-DOS, and Microsoft
Windows. I will not go into too great a detail on how to com-
pile or build Emacs on operating systems other than Linux.
Emacs was made to be a cross platform editor but there are
always some trade-offs if you don’t run them on Linux. Mac
OSX, in particular, seems to attract a great deal of conflicting
advice on how to best run Emacs; the best advice I can offer
is to try out a few different approaches and find one that fits
you.
Microsoft Windows Emacs releases official builds for
Microsoft Windows on their official site.1 Extracting
and running the executable is all it takes.
1 https://ftp.gnu.org/gnu/emacs/windows/
39

## [p.40]
First Steps
Most external tool support will not work on
Windows. Functionality like built-in grep support
requires the GNU coreutils to be present. You can, how-
ever, run Emacs from Cygwin2 and get a Linux-like
environment on Windows that way. Alternatively,
the cross-compiled GnuWin323 project has almost ev-
ery Linux command line program that runs natively
on Windows.
Another new opportunity that has sprung up is to use
the Windows Subsystem for Linux, a compatibility layer
that runs Linux natively on top of the subsystem in
Windows 10.
Mac OSX One approach (though there are several) is
to use an unofficial build of Emacs.4 There is also
Aquamacs but it differs from GNU Emacs quite a bit.
The topic itself is rather complex. Some prefer using
a package manager like homebrew and others do
not. Generally, people who use homebrew often use
the homebrew version of Emacs also. EmacsWiki’s
article5 on installing Emacs on Mac OSX is a good
place to start if you want to compile Emacs yourself.
Linux Emacs is almost always present in your distribution’s
package manager. Some distros are slow to update
to new minor releases (which are rarely minor at all,
adding a lot of new functionality and bug fixes) so it
may be worth your while to build from source.
2 https://www.cygwin.com/
3 https://gnuwin32.sourceforge.net/
4 https://emacsformacosx.com/
5 https://www.emacswiki.org/emacs/EmacsForMacOS
40

## [p.41]
First Steps
On Ubuntu, it’s as easy as apt-get install emacsNN
where NN is the major version of Emacs: 27, 28, and
so on.
If you want to build your own version of Emacs from
source, I recommend you use
apt-get build-dep
emacsNN to build and install Emacs’s dependencies.
From that point on it’s easy to follow the usual
configure, make, make install procedure outlined in the
build instructions.
Starting Emacs
Starting Emacs is as simple as running emacs from the com-
mand line. If you run the command from a window man-
ager, then Emacs will launch as GUI Emacs — as opposed to
Terminal Emacs where Emacs is running inside a terminal.
You can force Emacs to run in a terminal, even in a window
manager, by giving it the argument -nw, like so: emacs -nw.
There’s a host of command line switches you can pass to
Emacs, but you only need four to get started:
Switch
Purpose
--help
Display the help
-nw
Forces Emacs to run in terminal mode
-q
Do not load an init file (such as init.el)
-Q
Does not load the site-wide startup file6 , your
init file, nor X resources
6 The site-wide file is a global settings file like your own init file
41

## [p.42]
First Steps
If Emacs is giving you error messages when you start it, you
can use -q to prevent your init file from loading. If that fixes
the errors — then you have a broken init file and should take
steps to remedy that: revert to an older version, comment
out code until it works, or ask for help.
The Emacs binary follows the usual command line conven-
tions: emacs [switches] [file1, file2, ...].
The Emacs way is to keep it running and do all your edit-
ing in a dedicated Emacs instance. Emacs will typically start
slower than other editors (as it has a lot more packages and
features) as it’s designed for long-running sessions and not
quick edits.
Emacs Client-Server
So, how do you deal with situations where you’re whiling
away at the command line but have to edit a file? Maybe
you’re writing an email from the command line or writing
a commit message — you’d want to use Emacs, and ideally
the same instance of Emacs you already have running. The
answer, ignoring the fact that Emacs has first-class support
for both email and source control systems, is Emacs’s client-
server mode.
Note
The client-server functionality is fantastic, but I
wouldn’t spend too much time playing around
with it until you’re comfortable with Emacs ba-
sics.
The myriad advantages of Emacs’s server mode are:
42

## [p.43]
First Steps
A persistent session means Emacs will re-use the same ses-
sion instead of spawning a new, distinct copy of Emacs
every time.
It works well with $EDITOR by opening the files in your
shared Emacs session and automatically signalling the
calling program when the session finishes.
Fast file opening from the command line using the
emacsclient binary. The Emacs client will connect to
the local Emacs server instance and instruct it to open
the file.
There are several ways of activating Emacs’s client-server
mode:
M-x server-start launches a server inside an already-
running Emacs instance. The instance turns into a server
when you type this; there’s no visual feedback, per se, that
it’s running. When you exit this Emacs instance, it will shut
down the server also — so if you want a server daemon you
need the option below.
Emacs 28
If you’re using a window manager, and if it’s
reasonably modern, you can also run Emacs
(Client) or ask it to open files with that entry,
to re-use your existing Emacs instance.
emacs --daemon will run Emacs as a daemon. It will call
server-start, as above, but will return control to your
43

## [p.44]
First Steps
terminal immediately and run in the background, waiting
for client requests.
Emacs also ships with native support for systemd, if your
operating system supports it. You can activate the unit file
by running the command systemctl --user enable emacs.
Emacs’s daemon is then managed by systemd.
If you go the server route, you cannot use the default emacs bi-
nary any more. That binary will spawn standalone instances
only. You must use the similarly-named emacsclient instead.
Set your $EDITOR environment variable to emacsclient and
things should just work from then on.
The emacsclient binary has its own set of switches you
should know about:
Switch
Purpose
--help
Displays the help.
-c
Creates a graphical frame (if X is available)
or a terminal frame if X is unavailable.
-nw
Creates a terminal frame.
-n
The client will return immediately instead of
waiting for you to save your changes.
Practical if you just want to open a bunch of files.
When you launch an emacsclient instance, the client will
waitforthefile(s)tofinishediting.Pressing C-x #willswitch
to the next buffer you’re editing through a client — when
you’ve done this for the file(s) you opened, Emacs will sig-
nal to the client to exit and return control to the terminal.
If you’re using a tool like git that lets you use your $EDITOR
44

## [p.45]
First Steps
to edit commit messages when using other editors, git will
wait until it receives the go-ahead from your editor that it
has saved the commit message to a temporary file before re-
suming with the commit operation.
You can add the -n switch if you want the client to just open
the files and not wait. I use it when I’m doing exploratory
work or if I want the files “permanently” open in Emacs.
45

## [p.46]
First Steps
The Emacs Interface
When you first launch Emacs, you’re greeted with the splash
screen. It’s probably one of the first things most Emacs hack-
ers disable, along with the scroll bars, the menu and tool bar.
Until you’re comfortable with Emacs I would recommend
you leave the UI elements enabled since they will provide
you with a quick way to access common functionality that
you may not remember how to do off-hand, although they
take up valuable real estate on your screen.
46

## [p.47]
First Steps
If you’re using Emacs in the Terminal, you can still access
the menu bar by pressing F10.
If you don’t see a user interface similar to the figure above,
it’s most likely due to customizations made to your init file.
The quickest way to test this is to close Emacs and restart
it with emacs -q. If that fixes things, then it’s definitely cus-
tomizations made to your Emacs. Most starter kits assume
you’re reasonably familiar with Emacs and they often disable
things like the menu bar and tool bar.
You are actually free to play around with Emacs now: the
arrowskeyswill workfine and, combined with the menu bar,
you can open and save files. Emacs will auto-detect most file
types and apply the correct major mode to it — if it doesn’t,
you may have to install third-party packages, which I will
talk about later.
Keys
The most important subject in Emacs. Emacs is famous for
two things: its obscure keyboard incantations and that it’s
the kitchen sink editor that can do everything. The comic
strip xkcd7 humorously referenced that part of Emacs lore.
A much older joke is that Emacs stands for “Escape Meta Alt
Control Shift.”
Nevertheless, key modifiers are a big part of day-to-day
Emacs use so being able to “decode” a string of keys is
important.
7 https://xkcd.com/378/
47

## [p.48]
First Steps
In Emacs, there are several modifier keys you can use, each
with its own character:
Modifier
Full Name
C-
Control
M-
Meta (“Alt” on most keyboards)
S-
Shift
Two more exist for historical reasons (Super and Hyper)
but don’t have dedicated keys on today’s keyboards, but
for consistency with Space Cadet keyboards8 still exist
internally; another key (Alt) does exist on modern keyboards
but is bound (and known by) as Meta in Emacs:
Modifier
Full Name
s-
Super (not shift!)
H-
Hyper
A-
Alt (redundant and not used)
Super and Hyper can still be used, and if you’re the owner
of a Microsoft Windows-compatible PC keyboard – or use
a programmable keyboard – with the Start and Application
Context buttons, you can rebind them to serve as Super and
Hyper, which is an elegant way of improving the key space
available to you. Emacs supports the modifiers natively but
you need to tell your operating system or window manager
to bind them.
8 https://en.wikipedia.org/wiki/Space-cadet_keyboard
48

## [p.49]
First Steps
Important
It is not possible to type certain keyboard com-
binations in a terminal. It is a fundamental lim-
itation of the technology. My advice is to run
Emacs in a GUI, if at all possible.
Knowing the modifiers is only one half of the equation
though.
In Emacs, we formally define a key sequence (or just key) to
mean a sequence of keyboard (or mouse) actions and a com-
plete key to mean one or more keyboard sequences that invoke
acommand; if the sequence of keys is not a complete key, then
you have a prefix key. And if the key sequence is not recog-
nized by Emacs at all it is invalid, and an error is displayed
in the echo area.
That’s a rather dry definition, so let’s look at a few examples.
C-d calls a command named delete-char. To invoke it, hold
down control and press d. As the key is a complete key,
it will call the command delete-char and immediately
delete the character next to point.
C-M-d is similar to the example above, but this time you
must hold down both control and meta before you
press d.
Let’s try a few prefix keys. Prefix keys are basically subdivi-
sions — a way of grouping keys and increasing the number
of possible key combinations. For instance, the prefix key
C-x has several dozen keys bound to it. C-x is a prefix key
you will use all the time.
49

## [p.50]
First Steps
C-x C-f in Emacs runs a command called find-file. The
way to interpret it is to first hold down control and
then press and release x. In your echo area, Emacs will
display – after a small idle period of about a second
– C-x- (with a dash at the end) which is Emacs’s way
of telling you that it expects additional keys. Finally,
type C-f which should be easy for you to do now: hold
down control and press f.
To type C-x C-f, you don’t have to release the control
key between each key — keeping control pressed
helps you maintain something I call tempo, which I
will talk about later.
C-x 8 P has two prefix keys: first C-x and then 8, which is a
subcategory to C-x. So 8 on its own wouldn’t do any-
thing (it would just print the number 8) nor would C-x
or even C-x 8 — both are still prefix keys. The key is
complete only when you finish with P.
We call sets of keys that belong to a particular prefix
key key maps, which is how Emacs internally tracks
the mapping between a key and a command. In this
case, the key map C-x 8 has a variety of utility charac-
ters used in writing or mathematics but not bound on
most keyboards. For instance, C-x 8 P will insert the
paragraph symbol ¶.
C-M-% is a tricky one for beginners. Using what you’ve
learned above, hold down control and alt (and as
you’ll remember from the table above, Meta is Alt)
but also shift. The % character is typically shared with
50

## [p.51]
First Steps
a number on the keyboard number range and the
implication here is you must type shift also.
If you don’t press shift, you’re actually typing C-M-5
(on a US keyboard, anyway.)
It bears mentioning that this particular key is bound to
a popular command (M-x query-replace-regexp) and
is an example of a key that you cannot type in Terminal
Emacs because of the terminal’s technical limitations
(and not Emacs.)
TAB, F1–F12 and so on are occasionally written like this,
but also in angle brackets: <tab>, <f1>. It’s important
you don’t confuse TAB with the characters T A B.
Hint
If you’re stuck, or in the unlikely event Emacs
has seized up, or if you have typed in a partial
command that you want to cancel — press C-g.
That’s the universal “bail me out” command in
Emacs.
Caps Lock as Control
One of the most important modifications you should make
to your environment is rebinding your caps lock key to con-
trol. You’re going to use the control key a lot and to avoid the
Emacs pinky I suggest you unbind your left control entirely
and instead use caps lock.
Yes, it’ll be an annoying transition but a worthwhile one
(that will, incidentally, serve you well outside of Emacs.)
51

## [p.52]
First Steps
This change is necessary because on older keyboards9 the
control key occupied the space now used by the caps lock
key so reaching the left control key could be done without
straining your left pinky.
On Windows, I recommend you use SharpKeys.10 On
Ubuntu and Mac OSX, it’s built-in; go to the Keyboard
settings and change it. If you’re using another Linux
distribution you may have to fiddle with xmodmap.
Custom & Programmable Keyboards
If you own an ergonomic mechanical keyboard
– they tend to have customizable firmware –
you may want to go a step further and avoid the
use of your pinkies for all modifier keys. If your
keyboard has thumb keys or the ability to layer
keys, as many high-end ergonomic mechanical
keyboards often do, you should change your
keyboard layout so the control key, at the very
least, is within easy reach of your index or
thumb fingers.
M-x: Execute Extended Command
Only a small portion of available commands in Emacs are
bound to actual keys. Most are not: they are rarely used, and
do not warrant a key binding; or maybe you have explicitly
overridden the key it was bound to, leaving it unbound; or
perhaps you forgot its key binding.
9 https://en.wikipedia.org/wiki/Space-cadet_keyboard
10 https://github.com/randyrants/sharpkeys
52

## [p.53]
First Steps
In essence, it’s common that you want to run seldom-used
commands. To do this press M-x (pronounced mex, M x, or
meta x.) In your minibuffer, a prompt will appear and you
are free to input the name of a command you wish to run.
WhenEmacsuserssaysomethinglike“run M-x lunar-phases
to see the lunar phases of the moon” what they’re saying is:
hold down meta and press x and the M-x prompt will appear
in your minibuffer (that’s the line at the very bottom of
Emacs.)
At this point you can type in the name of the command. Try
it, enter lunar-phases and press RET. The lunar-phases com-
mand will open a new window on your screen displaying
the lunar phases from today onward. You can type C-x 1 to
hide the buffer.
You will frequently see both M-x lunar-phases RET and
M-x lunar-phases to indicate to you, the user, that you
must follow up the text you entered with RET. This is also
true of commands that prompt you for input. I will leave
out the RET unless I feel it’s ambiguous or unclear that you
must (or must not) use RET to proceed.
Hint
If you enter M-x by mistake, remember you can
type C-g to exit out again.
Emacs has built-in auto completion support so pressing TAB
will open a new window and list all the potential candidates.
As you type and press TAB, Emacs will automatically narrow
the list of candidates. If your partially-typed match only has
53

## [p.54]
First Steps
one candidate left when you press TAB, Emacs will complete
the whole name for you. You can also just press RET — it
completes like TAB but with the added benefit of running
the command if it’s the only candidate left.
You may think M-x is a special Emacs command but it’s actu-
ally not. It, too, is written in elisp and bound to a key just
like everything else.
Commands and functions
When I talk about commands, I’m talking about
a type of function that is accessible to the user.
For a function to be accessible to a user (notwith-
standing the ability to evaluate any expression
in elisp) it must be interactive, which is an
Emacs term for a function that has additional
properties associated with it, rendering it usable
through the execute extended command (M-x)
interface and key bindings.
So if you’re a package author, you have to
choose if a particular function is accessible to
the end-user through the M-x interface. Marking
it as interactive will make it accessible to end
users.
In other words, if it’s not interactive, you cannot
run it from M-x nor can you bind it to a key.
M-S-x: Execute Extended Command for Buffer
When you invoke M-x you’re shown every conceivable com-
mand you can execute in Emacs. That’s fine if you know
54

## [p.55]
First Steps
exactly what you’re looking for; less so if you don’t. This
is a problem that feeds into the concept of discoverability in
Emacs: or what it takes for you to find the thing you’re look-
ing for, even if you don’t really know what you are searching
for, exactly.
Emacs 28 adds M-S-x, a command that restricts executable
commands to a curated selection relevant to the current buffer.
As it draws from a list of commands with dedicated key bind-
ings, or those manually chosen by the mode authors, you
may find – as it’s a recent addition – that it’s rather sparse.
Nevertheless, I would recommend you make a mental note
of it, and use it as another tool in the toolbox to explore
Emacs.
Dealing with Shift
You may nave noticed the S- in M-S-x. Another
way of writing it is M-X, with the X capitalized,
as you’re turning x to X when you hold down
shift. I find the former easier to read, but both
are valid notations.
Universal Arguments
Some commands have alternate states, and to access them
you need to give them a universal argument (also called a pre-
fix argument.) The universal argument is also known by its
key binding C-u. When you prefix another key binding (this
includes M-x by the way), you’re telling Emacs to modify the
functionality of that command. What happens next will de-
pend on the command you’re invoking: some have zero, one
55

## [p.56]
First Steps
or even more universal argument states. If a command has
N states, you simply type C-u up to N times.
The universal argument is shorthand for the number 4. If
you type C-u a, Emacs will print aaaa on your screen. If you
type C-u C-u a, Emacs will display 16 characters (because 4
times 4 equals 16). Keep in mind that universal arguments on
their own are totally inactive. When you type them, Emacs
will, much like a prefix key, wait until you give it a follow-
up command — and only then will Emacs apply the univer-
sal arguments.
Understanding that Emacs’s command states are merely
numbers is a handy thing to know because you can also pass
arbitrary numbers to commands. A lot of Emacs hackers
would write C-u 10 a to print 10 characters, but there’s a
much easier way.
By the way
When you press a key – say the a button on your
keyboard – how does Emacs write it on your
screen? The truth is there’s a special command
called self-insert-command that, when invoked,
will insert the last typed key. Having this com-
mand adds symmetry to keys and commands: it
makes your regular keyboard characters behave
in exactly the same way as all other commands
in Emacs.
And that also means keyboard characters, and
hence self-insert-command, are subject to the ex-
act same rules as all other commands. They can
56

## [p.57]
First Steps
be unbound, rebound, and otherwise modified
by you.
Bound to key binding C-0 to C-9 are the digit arguments. But
they’re bound to more than just that row of keys to maintain
what I personally call the tempo of typing — but more on
tempo below.
Here are the various ways you can pass digit arguments to a
command.
Key Binding
Notes
C-u
Digit argument 4
C-u C-u
Digit argument 16
C-u C-u …
Digit argument 4^n
M-0 to M-9
Digit argument 0 to 9
C-0 to C-9
Digit argument 0 to 9
C-M-0 to C-M-9
Digit argument 0 to 9
C--
Negative argument
M--
Negative argument
C-M--
Negative argument
Note
The negative argument commands are bound to
the minus key (-) even though it’s hard to make
out from the table above.
They’re written as C-- instead of C- - because
the latter is an invalid Emacs key: you cannot
press a modifier key, C-, release it, and then press
-. That would just print - on your screen.
57

## [p.58]
First Steps
So I mentioned the importance of tempo. Once you’re com-
fortable with Emacs, you’ll be flying across the screen, and
not having to take your fingers off the modifiers to apply a
negative or digit argument will help you do that. You can
apply negative or digit modifiers with one of three separate
modifiers: C-, M-, and C-M-. They are redundant on purpose:
each modifier corresponds to an equally common key bind-
ing using one of those three modifiers.
Here are a few examples of what I mean.
M-- M-d kills the previous word before point. Without
M--, M-d would kill the word immediately following
point. The command has synergy with the negative
argument because you can keep your finger on the
meta key and press - d.
This combination maintains your tempo.
C-- M-d does exactly the same but it will take you about
thrice as long to type. You have to press C--, release
the control key, and then press M- followed by d.
This combination breaks your tempo.
A lot of people never bother working the digit and negative
arguments into their workflow, but I find them immensely
beneficial. Things like changing the casing on a word I just
typed are easily done by reversing the direction of a command
with a negative argument.
Maintain your tempo and avoid moving your fingers
away from the home row.11 Negative arguments add
11 If you touch type, a skill worth learning above all else.
58

## [p.59]
First Steps
directionality to commands; digits add repetition or
change how a command works.
Discovering and Remembering Keys
If you can’t remember the exact command for something,
then Emacs can help. Let’s say you can’t remember how to
print the paragraph character ¶, but you do remember it’s
somewhere in the C-x 8 key map, then all you have to do is
append C-h to any prefix key to get a list of all bindings that
belong to that key map.
Typing C-x 8 C-h will display a computer-generated list of
keys and their commands. This interface is hyperlinked and
part of Emacs’s self-documenting help system.
Key
Binding
C-x 8 "
Prefix Command
C-x 8 <
«
C-x 8 >
»
C-x 8 ?
¿
C-x 8 C
©
C-x 8 L
£
C-x 8 P
¶
C-x 8 R
®
C-x 8 S
§
C-x 8 Y
¥
Above is a subset of the commands you see when you request
the help page for C-x 8. If you see just a character in the Bind-
ing column, that means it’ll print the character when you
59

## [p.60]
First Steps
type that key.
However, Emacs will also tell you if there are more prefix
keys with further sub-levels; in this case, C-x 8 " has addi-
tional keys bound to it.
All these keys, hidden away in the dusty depths of Emacs, all
haphazardly bound to all conceivable permutations of key-
board characters, may seem like a strange thing particularly
if you come from modal editors like Vim.
The legacy of a particular keyboard used in the early ’80s is
evident in the names Super, Hyper, and Meta.
Back then, most Emacs keys were bound to a larger range of
physical keyboard modifiers but when the keyboard maker
(and the business that made the machines the keyboards were
plugged into) went bust, Emacs had to change with the times.
Instead of undoing the cornerstone of Emacs, the developers
shuffled the keys around and made them work on normal,
boring PC keyboards.
So you’re probably thinking it’s a daunting task indeed to
memorize all those keys — but you don’t have to. I memo-
rize what I use frequently (as we are wont to do with our
human brains) and leave the rest for Emacs to remember for
me.
Use Emacs’s help system if you forget a particular key
combination. You can always append C-h to a prefix
key.
60

## [p.61]
First Steps
Configuring Emacs
Tinkering with Emacs is every Emacs hacker’s favorite pas-
time. Go to Emacs meetups or talk to experienced Emacs
hackers and the conversation will inevitably drift towards
small changes and hacks they’ve made to make their lives
easier.
It’s fun (and rewarding) knowing that, if there’s an aspect
of your editor’s behavior that you don’t like that you can
simply change it — indeed, a whole book could be written
on the subject of changing Emacs.
Throughout this book I will make suggestions of things to
change. Where possible I will use the Customize interface in-
stead of the typical approach of suggesting elisp snippets.
If you want to change Emacs, you have two choices:
Use the Customize interface as it’s built-in and designed
to be user friendly. I say that, but a lot of people find it
cumbersome and hard to use. I think that’s a bit unfair:
it’s utilitarian and has to support a lot of arbitrary ways
of configuring fairly complicated features.
Not everything is supported by Customize. Since you
need to write elisp to change variables, and because of
the data-as-code paradigm LISP uses, you will find that
Customize can write elisp that it’s been shown how to
write, and then only for specific options. That makes
it a virtual impossibility to generalize an interface
across all of Emacs’s many, many settings. But most
of Emacs’s built-in packages support the Customize
interface and a lot of third-party packages do too.
61

## [p.62]
First Steps
I would strongly recommend you use the Customize in-
terface, where possible, until you’re comfortable writ-
ing elisp.
Write elisp toalterwhatyouwanttocustomize.Thisisthe
most powerful option but also the most complicated.
You’ll have to learn elisp (it’s not too hard, and writing
it is usually a lot of fun) to do this, but I think, in the
long run, it’s worth doing.
I still use the Customize interface myself when I
change font faces. There are hundreds of font faces
in Emacs; everything from font lock faces (syntax
highlighting) to the color of the modeline, the fonts
to use for the info manual, and more.
The Customize Interface
The Customize interface is divided into groups and sub groups.
Each group typically represents one package, mode, or piece
of functionality. The top-level group is called Emacs and con-
tains, as you would expect, all other groups.
To access the customize interface, type M-x customize. A
buffer called
*Customize Group: Emacs* should appear
with a list of groups. This is one part of Emacs where
using a mouse can be beneficial; the interface has buttons,
hyperlinks and edit boxes much like a browser would. Click
around — explore the interface, and marvel at just how
much stuff there is to configure! And that’s just the things
exposed to the Customize interface.
Searching in Customize
62

## [p.63]
First Steps
You can search for customizable options using
the search bar at the top.
The Customize interface is rather byzantine but once you
understand how it works, it’s quite easy to use. The figure
above shows one face: font-lock-string-face. That’s the
actual elisp variable name for the face; the pretty-printed
name is Font Lock String Face and what you’ll see in the
figure above. To the immediate left is an arrow — it’s tiny
but it’ll hide/show each face. On a Terminal, it’s replaced
with the arguably more legible texts Hide or Show.
As a quick aside, the Customize interface is made up of
two things: faces and options. Options are a catch-all term for
things you can Customize that aren’t faces.
63

## [p.64]
First Steps
The font-lock-string-face governs the face for strings —
and what a string is depends on the mode in which it is used.
For most programming major modes, it’ll be for actual lit-
eral strings in the source code, but mode authors are free to
use the font faces for whatever they please. Having said that,
most adhere to the naming standard for each face.
My personal foreground face color is OrangeRed. But there’s
nothing stopping me from adding additional attributes as
64

## [p.65]
First Steps
the figure above shows.
Supported colors
If you’re using Emacs in a GUI, you are lim-
ited only by the color depth of the display
and you are free to pick any color from the
RGB color space. I use named colors, and to
see a list of supported names you can type
M-x list-colors-display. If you’re on a Termi-
nal, you will be shown the colors supported by
your Terminal.
24-bit colors are also supported in the Terminal
in addition to the usual 16 or 256. If you’re not
seeing the colors you expect to see, you should
read the Info manual FAQ on how to configure
your Terminal:
Type M-x info-apropos then enter Colors on a
TTY. After a little while you should be presented
with a hyperlink to the FAQ that explains how to
configure your Terminal settings.
In Emacs 28, you can set the environment
COLORTERM=truecolor and Emacs will figure
out what it needs to do, regardless of your
system’s terminal capabilities. If you struggle to
get 24-bit colors, try setting that environment
variable.
Making the changes in the Customize UI isn’t enough. You
have to apply the changes and optionally save them also. If
you don’t save them, the changes will not persist between
65

## [p.66]
First Steps
Emacs sessions. Pressing the aptly named Apply and Apply
and Save do just that. The Revert… button is similar but has
a few more options. You only need Revert This Session’s Cus-
tomizations if you’re unhappy with the changes you have ap-
plied. Keep in mind it will only revert the options you have in
the current buffer — not all the customizations made globally.
Always remember that you can revert your changes until
you save. After that, you have to manually go through and
undo or use the Revert… button’s Erase Customizations op-
tion.
All Customizations are stored in your init file by default (or
possibly a separate custom file) and like the rest of Emacs the
changes are stored as elisp code, making it possible for you
to go back and manually change the elisp.
Instead of navigating through the tree of groups, you can
use one of several shortcut commands:
M-x customize displays the Customize interface and all the
groups.
M-x customize-option asks for a customizable option and
opens the Customize UI with that option present.
M-x customize-browse opens a tree group browser. Much
like the regular Customize interface but without the
group descriptions.
M-x customize-customized customizes options and faces
that you have changed but not saved. Worth keeping
in mind if you cannot recall if you have unsaved
options.
66

## [p.67]
First Steps
M-x customize-changed displays all options changed since a
particular Emacs version. Good way to discover new
features and options.
M-x customize-face prompts for the name of a face to
Customize. I recommend you put your point on
the face you want to change. It’ll fill in the name
automatically.
M-x customize-group prompts for a group name (e.g.,
python) to Customize.
M-x customize-mode customizes the major mode of your
current buffer. You should do this for every major
mode you use. It’s a quick way to change things and
gain an overview of what your major mode can do.
M-x customize-saved Displays all your saved options and
faces. Extremely handy if you want to track down
and disable errant changes.
M-x customize-themes Shows a list of installed themes you
can switch to.
I encourage you to use the Customize interface to configure
Emacs. It only has a subset of things you can (or want) to
change, but it’s enough to get you started on the road to
personalizing Emacs.
As you continue to use and personalize Emacs you may even-
tually reach a point where your init file is unmanageable.
When that happens it’s common to split up your changes
67

## [p.68]
First Steps
into groups of related changes. However, this is a low prior-
ity task until you’re comfortable (and your init file splitting
at the seams) with Emacs.
Evaluating Elisp Code
Frequently, you will find or write snippets of elisp code on
the Internet and you’ll want to evaluate it — closing and
restarting Emacs every time is a chore.
There are a number of different ways of doing this and I have
only shown a few of the different methods available to you.
You can read Evaluating Elispin Emacs12 for a thorough study
of the subject.
Restarting Emacs is the simplest way, which I recommend
if you have broken something in Emacs or if you want
to be sure things work in a fresh environment.
M-x eval-buffer will evaluate the entire buffer you’re in.
This is what I use to evaluate something.
M-x eval-region evaluates just the region that you have
marked.
Naturally, this is just scratching the surface. You shouldn’t
need to know much more than this to deal with the odd bits
of code you see and want to try out.
12 https://www.masteringemacs.org/article/evaluating-elisp-emacs
68

## [p.69]
First Steps
The Package Manager
Emacs comes with a package manager that seamlessly dis-
plays and installs packages from centralized repositories.
There are several package repositories available, and your
Emacs is configured to read from the official GNU reposito-
ries. However, you should also add MELPA, a volunteer-run
package repository. The package manager will merge all the
different listings into one.
As the repositories are privately owned by volunteers, they
may go down – temporarily or permanently – so I would
check the Emacs Wiki13 for a current list of repositories.
Type
M-x package-list-packages
and
Emacs
should
retrieve the package listings from your configured reposito-
ries. When it’s done, a new buffer will appear listing all the
packages. Like a lot of ancillary buffers in Emacs, this one
is also hyperlinked. Have a browse — you can one-click
install the packages you care about from the detail page of a
package.
Hint
If you know the name of the package, you
can use the shortcut M-x package-install and
enter the name in the minibuffer. And like
most minibuffer prompts, this one also has TAB
completion.
The package archive(s) change constantly and – especially
if you leave Emacs running for long periods of time – your
13 https://www.emacswiki.org/emacs/ELPA
69

## [p.70]
First Steps
local copy becomes stale; to remedy this, you can refresh the
catalog by typing M-x package-refresh-contents.
Custom Color Themes
If you dislike the default color scheme in Emacs —
then good news, you can use a custom theme. Type
M-x customize-themes to see a list of your installed custom
themes. There are more available for free from Emacs’s
package manager or sites like Github.
To install a theme with the package manager, open the
package manager (M-x package-list-packages) and go look
for themes; most will have the suffix -theme, and they act
and install like normal packages. Once you’ve installed the
themes you need, use the M-x customize-themes interface
to try them out. You can override specific colors you don’t
like by using the regular Customize interface described in
The Customize Interface. Changes made in the Customize
interface take precedence over the themes.
I should mention that you can have multiple themes active
at the same time, so make sure you are aware of this.
Getting Help
As I mentioned earlier when I talked about keys, Emacs is a
sophisticated self-documenting editor. Every facet of Emacs
is searchable or describable. Learning how to do this is abso-
lutely essential to mastering Emacs. The utility of knowing how
to find the answers to questions is something I cannot over-
state enough. I use Emacs’s self-documenting functionality
70

## [p.71]
First Steps
all the time; to jog my memory, or to seek answers to ques-
tions I don’t know.
Terminology
You’ll see the word symbol used a lot when I
discuss Emacs’s documentation systems. It’s
not that the word is unique to that part of
Emacs, but that it expresses anything you could
reasonably look up: be it a variable, function,
face or something else entirely.
I still haven’t talked about the actual core of Emacs yet
(movement, editing, and so forth) because, although that’s
obviously critical to mastering Emacs, they are specific
skills that you could, with patience, acquire by using
Emacs’s self-documenting help systems.
Knowing how to get help is critical because:
Emacs knows best Your Emacs configuration will differ
– sometimes just a little bit, other times a lot –
from other people’s Emacs configurations. Asking a
question on the Internet will only give you general
answers. If you rebind keys, only your Emacs knows
what the keys are.
You will discover more of Emacs I have stumbled upon
more cool features than I can count simply by explor-
ing — maybe a time saving command hidden away in
a major mode, or a variable that changes the behavior
of a command I use frequently.
71

## [p.72]
First Steps
A lot of third-party packages may not have an
adequate user manual, forcing you to read the source
or investigate the commands and variables exposed
by the package.
It will help you solve problems I help people with Emacs
questions all the time, but I don’t know everything —
what I do know is where to look and how to read the
documentation.
It gives you confidence Not knowing how to do some-
thing in Emacs is normal but also confusing. But
being able to say that “oh, I don’t know how to do
this but I do know where I can look for help” — your
confidence in Emacs will go up in step with your
knowledge.
Let’s start with the menu bar.
The Menu Bar
If you’re using the default Emacs installation – that is, you
are not using someone else’s Emacs configuration – you
should have a menu bar at the top of the screen. If you do
not see it, you can toggle it with M-x menu-bar-mode.
Key
Purpose
M-x menu-bar-mode
Toggle the menu bar
Mouse
Interact with the menu bar
F10
Open the menu bar
M-‘
Interactive keyboard-driven menu bar
72

## [p.73]
First Steps
If you’re running Emacs in a terminal, you may have to
type M-x xterm-mouse-mode to make it clickable. You can
also press F10 (or M-x menu-bar-open) to open it, or M-‘ to
activate an interactive, keyboard-led version of the menu
bar. All work well, so do experiment.
The menu bar is commonly derided as being “not useful”
and “taking up valuable screen real estate”. The same is said
of its friend the tool bar (M-x tool-bar-mode) and, yes, even
the scroll bar (M-x scroll-bar-mode).
If you are reasonably new to Emacs, I recommend you leave
the menu bar visible. It is useful; it does not take up a lot
of space. You will see a wide range of people parrot the idea
that it is not useful. I, unfortunately, was told the same when
I was new to Emacs, so I disabled it and forgot it existed. It
made learning Emacs harder than it should be. Do not make
the mistake I did. Whether you want to use the scroll bar or
tool bar is up to you. Both have their place, though perhaps
less so the tool bar, though it is also contextual.
The menu bar has a large range of commands, and minor
and major modes often add their own menu bar entries. The
menu bar covers all the basic commands, and lists all the ma-
jor ways you can ask Emacs for help. The latter especially is
of extreme importance.
Whether you want to use the menu bar or not is up to you,
but I do recommend you at least glance at it, and remember
that its ultimate purpose is to help you familiarize yourself
with Emacs and some of its features.
73

## [p.74]
First Steps
Quick Help
Emacs 29 adds a rudimentary quick help system – if you re-
member the cardboard keyboard overlays people used to use
for word processing in the 80s and 90s, then it’s a bit like that
– bound to C-h C-q. It’s got a range of common Emacs key
bindings and a brief explanation of what they do. You won’t
master Emacs from using it, but if you lose track of the most
common key bindings, it may help you.
Key
Purpose
C-h C-q
Display Quick Help at
the bottom of the frame
M-x help-quick-toggle
Toggle Quick Help
q
Closes the help (from the
Quick Help buffer)
The Info Manual
Emacs’s own manuals (and indeed, all manuals in the GNU
ecosystem) are written in TeXinfo. If you have ever used the
command line tool info, you will have interacted with the
TeXinfo hypertext viewer. Emacs, obviously, has its own
info viewer. Emacs’s info manual contains more than just
topics relating to Emacs. By default, the info browser will
index all the other info manuals installed on your system
— things like the GNU coreutils manuals will also be present,
and some Emacs packages also install info manuals.
The command line info browser is a lot more basic than the
one inside Emacs. If your experience with info manuals are
74

## [p.75]
First Steps
shaped by that tool, then you’ll find some solace in knowing
that the builtin info viewer in Emacs is far better and more
ergonomic.
To access Emacs’s info reader type M-x info or press C-h i.
info, the documentation browser, will appear and you are
free to use your mouse to click on the hyperlinks, or use
this table of keyboard shortcuts to navigate:
Key
Purpose
[ and ]
Previous / next node
l and r
Go back / forward in history
n and p
Previous / next sibling node
u
Goes up one level to a parent node
SPC
Scroll one screen at a time, then
page to next node
TAB
Cycles through cross-references and links
RET
Opens the active link
m
Prompts for a menu item name and opens it
l
Go back
q
Closes the info browser
The info viewer works in much the same way as a web
browser, though the key bindings do differ a little bit.
Because info manuals have hierarchies, in much the same
way this and most other books do, you’ll want to use [ and
] to navigate if you’re reading an info manual end-to-end.
That’s equivalent to reading a book starting from a chapter,
moving through all the sub-chapters, sub-sub-chapters, and
so forth, in the order they were laid out.
75

## [p.76]
First Steps
Everyday reading
For everyday reading, you want SPC for brow-
sing and reading as it “does what you want.” It
thumbs through a page until it reaches the end.
Then, it either picks the next sub node or the
next chapter. For browsing, use [ and ] to cycle
back and forth through nodes.
If, instead, you want to jump to the next or previous sibling
node you should use n and p. To go back or forward in his-
tory (much like a browser) use l and r.
The key u goes up one level to the parent; TAB cycles through
the hyperlinks, and RET opens them.
Most info manuals are also published in HTML versions on-
line, so why use Emacs’s own reader? For one, you can use
Emacs’s universal bookmark system (and more on that later.)
You can bookmark almost everything in Emacs: info pages,
files, directories, and more. The other advantage is that it’s in
Emacs, so keeping the info manual in a split window next to
you is particularly desirable if you’re reading Emacs’s excel-
lent An Introduction to Programming in Emacs Lisp and writing
code alongside it.
If you want to read up on a specific Emacs functionality, you
have to open the Emacs manual first. To do this, type C-h i
followed by m. When prompted for a menu item, type Emacs
for the Emacs manual or Emacs Lisp Intro for the introduc-
tion to elisp. As always, there is TAB completion. You can
also browse the master list of manuals and find the one you
want to read.
76

## [p.77]
First Steps
Emacs 28
You can open a manual with the key binding C-h
R. To open Emacs Lisp Intro type C-h R eintr.
You can look up the documentation for a command
by typing C-h F and at the prompt enter the name of a
command. Emacs will jump to the correct place in the info
manual where the command is described.
Apropos
Emacs has an extensive apropos system that works in much
the same way as apropos does on the command line. The
apropos system is especially applicable if you’re not entirely
sure what you’re looking for. There is a variety of niche
commands that only search particular aspects of Emacs’s self-
documenting internals.
Apropos is another tool to have in your toolbox. It shines
because you can narrow what you’re looking for to a par-
ticular area. If you’re looking for a variable, you can use the
apropos system that searches variables; if you are looking for
commands, you can search by command. And all of apropos
supports regular expressions.
The most common one, bound to C-h a, is M-x apropos
-command. apropos-command shows all commands (and just the
commands, not functions) that match a given pattern.
For instance, you might be on the hunt for commands that
work on words (but more on what a “word” actually means
in What Constitutes a Word?) so entering C-h a followed by
77

## [p.78]
First Steps
-word$, is a good place to start. That will list all commands
that end with -word.
Here’s a subset of the output you would see if you ran that
command:
Command
Key
Purpose
ispell-word
M-$
Check spelling of word under
or before the cursor.
kill-word
M-d
Kill characters forward until
encountering the end of a word.
left-word
C-<left>
Move point N words to the left
(to the right if N is negative.)
mark-word
M-@
Set mark ArG words away
from point.
As you can see, you get the name of the command, the keys
bound to it (if any) and the purpose. Emacs has certain nam-
ing conventions and once you’re familiar with Emacs, you
will see certain patterns emerge. For instance, it’s common
to postfix a command with the syntactic unit or context it op-
erates on: -word for words, -window for windows, and so on.
Hint
Apropos can sort results by relevancy. Type
M-x customize-option RET apropos-sort-by-scores
RET to customize it.
There’s a wide range of apropos commands you can use
to query Emacs. apropos-command is my choice as the most
78

## [p.79]
First Steps
important command to memorize. As it’ll let you search
by pattern, you need only remember part of a command’s
name, but not all of it, to find what you are looking for. It’s
also a fantastic way to accidentally discover new features
in Emacs. Giving apropos-command the .+ pattern (to match
everything) yields thousands of commands that Emacs
knows about.
Emacs has a range of specialist apropos commands that you
might find more suitable.
M-x apropos The thermonuclear option. This command
will display all symbols that match a given pattern.
If you’re trying to track down both variables,
commands and functions relating to a pattern.
M-x apropos-command or C-h a As I explained above, this
command will list only the commands.
M-x apropos-documentation or C-h d Searches just the doc-
umentation. In Emacs parlance, that means the doc
string (documentation string) with which you can sup-
ply symbols. Has its uses, if all other options fail.
M-x apropos-library Lists
all
variables
and
functions
defined in a library. Use it if you’re investigating a
new mode or package.
M-x apropos-user-option Shows user options available
through the Customize interface. This is one way to
get the symbol names of Customize options, but
if you’re looking for ways to search the Customize
interface, you are better off using the Search box in
79

## [p.80]
First Steps
the Customize interface as it lets you customize the
matches as well. I never use it.
M-x apropos-value Searches all symbols with a particular
value. If you’re looking for a variable that holds a
particular value, this command may be of use to you.
A potential use is if I know the value of a variable but
not the name or where it’s defined.
If you’re unsure of what you are looking for – maybe you
only have part of a name, or you just remember a bit of the
documentation – then apropos is a tool that can help you.
I find apropos indispensable; it’s a great way to list all the
commands that match certain patterns and an even greater
way to discover new commands.
The Describe System
What captures the beauty of Emacs’s self-documenting na-
ture is the describe system of commands. If you know what
you’re looking for, then describe will explain what it is. Ev-
ery facet of Emacs – be it code written in elisp or the core
layer written in C – is accessible and indexed through the de-
scribe system. From keys, to commands, character sets, cod-
ing systems, fonts, faces, modes, syntax tables and more —
it’s all there, neatly categorized.
The describe system is not static. Every time you query a
particular part of Emacs, it will fetch the required details
through an internal introspection layer which itself queries
Emacs’s own internal data structures. Both the introspec-
tion layer and internal data structures are queryable by
80

## [p.81]
First Steps
you through elisp. There are no “secrets” in Emacs —
sure, the documented API layer is the recommended way
of accessing Emacs’s own internal state, but unlike other
editors and IDEs you are not beholden to the package author
or Emacs maintainers. I think this embodiment of openness,
beautifully captured by the describe system, is one of the
best features of Emacs.
You can find the most important describe keys bound to the
C-h prefix key14 ; there’s more, a lot more actually, but I
think most of them are of limited utility to all but elisp writ-
ers.
I use the describe system constantly. In writing this book, I
have used both the info manual and apropos extensively, but
the describe system is what I use to double check that ev-
erything I have written is correct. If you ever find yourself
wondering what a symbol in Emacs does (be it a function, a
command, a variable or a mode) then describe will tell you.
The only slight downside to the doc string is that it assumes a
technical audience: the info manual generally does not. It’s
not all bad, you don’t have to be an elisp expert to make sense
of the description but it will take a bit of time to familiarize
yourself with the terminology used in the doc strings.
Remember, the describe system describes a living system —
your personalized Emacs.
You need to memorize these five commands as they are the
most important ones for day-to-day Emacs use.
14 As I mentioned in the Keys chapter, you can follow up a prefix key
with C-h to list all the known bindings.
81

## [p.82]
First Steps
M-x describe-mode or C-h m Displays the documentation
for the major mode (and any minor modes also
enabled) along with any keybindings introduced by
said modes. The describe command looks at your
current buffer.
This command should be your first port of call when
you’re using a new major mode. You will discover a lot
of Emacs’s functionality this way and it is absolutely
imperative that you use this command.
What it doesn’t do is list mode-specific commands that
are not bound to any key: they are simply not shown.
M-x describe-command or C-h x Introduced in Emacs 28,
this command only describes commands, and not
functions like its sibling below.
If you’re looking for an interactive command, I would
use this.
M-x describe-function or C-h f Describes
a
function.
Another command on the critical path to mastering
Emacs. Knowing what something does in Emacs (and
how to look it up) is essential, but so is being able to
jump to the part of the code where it’s declared.
Describing a function will give you the elisp function
signature, the keys (if any) bound to it, a hyperlink to
where it’s declared, and a doc string.
If the function is a command, it will say it is interac-
tive. I recommend you use describe-command if you’re
using Emacs 28 and you are looking for commands.
82

## [p.83]
First Steps
M-x describe-variable or C-h v Describes a variable. Like
describe-function, this command is also important,
but perhaps less so as changing variables is not always
easy to do for a beginner. Nevertheless, being able to
read up on what a variable does is.
M-x describe-key or C-h k Describes what a key bind-
ing does. Of all the commands, this is one of
the most worthwhile ones to memorize, and like
M-x describe-function it’s a command you will use
frequently. If you’re unsure what a key binding does,
simply enter the describe-key interface and re-type
the key — and Emacs will tell you what it does.
It’s worth remembering that some keys come from
major and minor modes and are not global. Therefore,
you may get a different answer depending on the
buffer in which you type the command.
Emacs 28 adds a couple of handy shortcuts to all describe
buffers. They’re worth knowing about, though all but i are
accessible through hyperlinks in the buffer itself.
Key Binding
Purpose
i
Open the Info manual
s
Jump to the source definition
c
Open the Customize interface
Emacs does have a lot more describe commands but they’re
nowhere near as practical for day-to-day use. But if you ap-
83

## [p.84]
First Steps
ply the skills you have just learned, you will find it a trivial15
exercise to list all of them.
15 Hint: apropos-command is a good place to start.
84
