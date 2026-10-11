# 实用篇（三）：Dired、Shell 命令、Emacs 里的 Shell

> 原书来源：Mastering Emacs (Eli Spare)，第 300–319 页。
> 覆盖范围：Dired, Shell Commands, Shells in Emacs

## [p.300]
The Practicals of Emacs
Keys
Description
w
Copy link at point
Emacs 28
In Emacs 28, EWW now shares a bookmark sys-
tem with the rest of Emacs.
The most common commands to use is TAB and S-TAB to
open hyperlinks; and l and r as they are the ones you will
use to go backward and forward through the browser history.
The commands p, n, u and t only work if the web page se-
mantically says which hyperlinks are the next and previous
ones.
You can switch to a reader mode with R. It’s great. It strips out
– or attempts to, but EWW gets it right most of the time – all
the distractions and leaves just the main body of text. Great
for reading.
The command M-s M-w is also handy. It will take the active
region and send it to the default search engine (usually Duck-
DuckGo) and display the results in EWW.
Dired: Files and Directories
Both browsing and interacting with files and directories on
your file system is a task for which Emacs is eminently well-
suited. Aside from editing local files the usual way, and re-
mote files using TrAMP, you can manipulate directories and
files using Emacs’s directory editor, dired.
300

## [p.301]
The Practicals of Emacs
To access dired, you can do so in multiple ways:
From IDO or FIDO mode You can type C-d when finding
files with C-x C-f to open a dired buffer in that file’s
current directory.
As a command The command M-x dired opens a prompt
that asks you for the dired location to open. It defaults
to default-directory, the directory the current buffer
is in. As with TrAMP, if the file is remote Emacs will ask
you if you want a remote dired session.
As a key bind The key binding C-x d works identically to
the command above. The command, C-x 4 d, does the
same but in the other window.
When you open a dired buffer in Emacs, you’re greeted with
a view that looks similar to this:
/usr/share/dict:
total used in directory 2328 available 187646744
drwxr-xr-x
2 root root
4096 Feb 16 09:57 .
drwxr-xr-x 326 root root
12288 Mar 27 11:43 ..
-rw-r--r--
1 root root 938848 Oct 23
2011 american
-rw-r--r--
1 root root 938969 Oct 23
2011 british
If you use the Linux command line, its output should look
familiar. That is because Emacs, in keeping with the spirit
of other commands like M-x grep, simply augment the out-
put from existing command line utilities. In this case, it is
usually ls -al, but you can change the switches used by cus-
tomizing dired-listing-switches.
301

## [p.302]
The Practicals of Emacs
Microsoft Windows
If you use Microsoft Windows, then don’t
worry. Emacs includes a ls emulation layer
written in elisp. Instead of calling out to ls,
Emacs will instead query the operating system
directly. The end result is a seamless interface
that works across platforms.
As I talked about earlier, the concept of The Buffer
and Emacs’s “augmentation” system is a powerful and
pragmatic way of talking to external programs. When
Emacs calls out to ls, the output is inserted into the buffer,
the dired-mode activated, and the text augmented with
highlighting and hyperlinks and other hidden properties
to help Emacs navigate the text mechanically. The major
mode itself supplies the key bindings so that pressing RET
on a file opens it. Indeed, as with any buffer, you can copy
the output of dired as it is basically plain text.
Most Emacs beginners – and even intermediate users – never
really get to grips with dired. Most never get beyond navi-
gating directories with it, which is a shame because behind
its simple exterior is a very complex and efficient system for
file and directory operations. Indeed, there are hundreds of
dired commands and dozens of interactions with other com-
mands that work seamlessly with dired’s interface.
Navigation
Navigating dired is fairly straightforward and since it’s a
buffer, all your usual navigational aids work: Isearch, arrow
keys, the mouse, and so on.
302

## [p.303]
The Practicals of Emacs
Keys
Description
RET
Visits the file or directory
^
Goes up one directory
q
Quits dired
n, p, C-n, C-p
Moves the point up/down a listing
However, ^ is the key you need if you want to go up one
directory to the parent of your current directory. The com-
mands C-n and n & C-p and p go down or up a line but also
reorient your point so it is positioned right before the file-
name.
When you press RET, Emacs will visit the file or directory; if
it is a directory, a new dired buffer is opened. So pressing q
after visiting a sub-directory should take you back to your
last dired buffer.
Marking and Unmarking
Marking and unmarking things is something you’ll do fre-
quently if you want to carry out operations on multiple files
or directories.
Keys
Description
m
Marks active
u
Unmarks active
U
Unmarks everything
d
Flags for deletion
An important distinction must be made between marking
303

## [p.304]
The Practicals of Emacs
andflaggingfordeletion: dflagsfordeletion (anda Displaced
next to the flagged item) and m marks. Marks are never af-
fected by the delete command, and vice versa, except for one
command that deletes marked files. Marked files are high-
lighted with *.
Marking and flagging both advance the point to the next
item (as though you’d typed C-n) but you can reverse direc-
tion with a negative argument.
Discover more
There are so many commands in dired that list-
ing all of them is not possible. I recommend you
apply the usual exploratory approaches (Apro-
pos, describing the mode, listing keys bound to
prefixes) to discover the rest.
There are also mark commands that mark specific things:
Keys
Description
* m
Marks region
* u
Unmarks region
* %
Marks files by regexp
* .
Marks files by extension
t, * t
Toggles marking
* c
Changes mark
The prefix key * is full of mark commands. Shown above
are the four most practical ones for day-to-day use. The re-
gion keys mark or unmark every dired item touched by an
304

## [p.305]
The Practicals of Emacs
active region. The regexp and extension mark commands
are similarly useful, and you can use * t to toggle (invert)
the marks.
* c is special. It changes the mark symbol from old to new. So,
you can change * (the default mark symbol) to D and turn
the marked files into files flagged for deletion. However, as
deleting is practically the only thing you’d want to do with
flagged files, there is a special command that deletes flagged
files and another that deletes marked ones too.
One other thing you can do with * c is collate files into dif-
ferent mark symbols, knowing that the mark commands op-
erate on just * and D. For example, you can swap * for C to
indicate that you intend to copy them later. That is an easy
way to have multiple “selections” of files and directories.
Operations
You can carry out actions – or operations – on either the ac-
tive item (if there are no marked files in dired) or the marked
ones, if there are.
When you operate on marked files, Emacs will usually ask
you to confirm the action, and lists the affected files. Like
the mark commands, there are many operations you can do.
Let’s take a look at the basic ones first:
Keys (Marked files)
Description
C
Copy files
R
Rename or move files
O
Change owner
G
Change group
305

## [p.306]
The Practicals of Emacs
Keys (Marked files)
Description
M
Change permissions
D
Deletes marked (shown as *)
x
Deletes flagged (shown as D)
F
Visit files (requires dired-x)
c
Compress marked to a file
Most of the keys above are self-explanatory. Just remember
the difference between x and D if you want to delete files.
Copying or renaming between dired buffers
You can copy or rename (move) files between
two windows with dired buffers if you cus-
tomize
the
option
dired-dwim-target.
Be
careful you don’t accidentally move files to an
errant dired buffer you forgot you had open —
I’ve made that mistake myself quite a few times!
There are also keys that don’t act on marked files specifically:
Keys
Description
g
Refreshes dired buffer
+
Creates a sub-directory
s
Toggles sorting by name/date
<, >
Jump to prev/next directory
j
Jumps to file
Dired-X
306

## [p.307]
The Practicals of Emacs
Some commands require dired-x. It’s an op-
tional package that adds useful features to dired.
Emacs 29 moved a handful of features from
dired-x to regular dired, but as it’s so low-effort
to enable dired-x, I recommend you just add
this to your init file:
(require 'dired-x)
With dired-x installed you can use F, which visits all marked
files. Importantly, it will attempt to open files and give each
file its own window — which you may not want. To avoid
this, and open them in the background, type C-u F.
Keys (Marked files)
Description
M-s a C-s
Begin isearch
Q
Xref Query replace regexp
A
Xref Search by regexp
!
Synchronous shell command
&
Asynchronous shell command
Occasionally, you have to either search through or replace
text in files and you can multi-file Isearch with the rather
awkward key binding M-s a C-s. The command, Q, calls
C-M-% – query replace regexp – on every marked file. But
don’t forget to save the changes (C-x s to query to save
every unsaved buffer.)
Call !withnomarksanddiredwillattempttoguessthenext
operation on that file if dired-x is enabled: If it’s a .zip file, it
307

## [p.308]
The Practicals of Emacs
will ask if you want to unzip it. If it’s a .patch file, Emacs
will call patch on it. There are many patterns specified in the
variable dired-guess-shell-alist-default. It’s a great time
saver.
With active marks, then ! and & will instead call out to an
external command of your choice. You must also tell Emacs
how to pass the marked items to the command:
One command per marked item In this mode Emacs will
call the command you chose once for each marked
item.
One command for all marked items Here
Emacs
will
space-separate each marked item and pass them to a
single command.
Because some commands may take a long time to run, you
must decide if you want Emacs to call the command syn-
chronously, and thus block Emacs until it’s done, with !; or,
you can tell Emacs to spawn the command asynchronously,
with &.
Here’s a practical example. Consider these two files:
american-english and british-english, and depending on
how you phrase the shell command, the behavior changes.
You can optionally specify either * or ? to indicate whether
you want one command per mark, or one command for all
marks.
* works like a shell’s file glob pattern and Emacs inserts all
marked files as one long argument to a single command:
308

## [p.309]
The Practicals of Emacs
echo *
Prints:
american-english british-english
Because Emacs ran the command once with both marked
items.
Whereas ? will instead run the command for each marked
item:
echo ?
The output, then, is:
american-english
british-english
The output, if there is any, is printed in the echo area if
it is only a few lines. Otherwise, it is redirected to a dedi-
cated buffer called either *Shell Command Output*, or *Async
Shell Command*.
Working Across Directories
Instead of opening directories in new dired buffers, you can
tell it to insert their content into an existing dired buffer.
When you type i with point on a directory, dired inserts
it in the same dired buffer as a sub-directory. That means you
309

## [p.310]
The Practicals of Emacs
can use the same mark and flag commands across dired direc-
tories provided they are in the same dired buffer. You can
collapse a sub-directory – meaning commands won’t apply
to it while it is collapsed – with $.
By inserting multiple directories into a shared dired buffer,
you can not only glance at multiple directories at the same
timebutyoucanalsoworkonthemasthoughtheywereone
large directory. This is another powerful but underutilized
feature in Emacs.
There is another approach, however, as typing i is tedious
and won’t work well if you recursively want to apply a dired
or shell command.
To get around that problem, you can use Emacs’s find wrap-
per commands. I consider these commands, combined with
the power of dired, to almost completely replace all direct
use of find and xargs. With dired’s shell command support
and extensive file operations, I can do in Emacs what most
people struggle to do well with find.
All commands take the output of find and build a dired
buffer relative to a starting directory. Emacs is clever enough
to notice the relative paths in what was the filename portion
of the buffer. All commands in dired work as usual.
Commands
Description
find-dired
Calls find with a pattern
find-name-dired
Calls find with -name
find-grep-dired
Calls find and grep
find-lisp-find-dired
Uses Emacs and regexp to find files
310

## [p.311]
The Practicals of Emacs
The first three commands call out to find, the command
line utility. find-dired, like with the grep commands, is the
most basic one: you have to give it a find pattern and a start-
ing directory. find-name-dired finds by shell glob patterns
against the filename only, starting in a particular directory
of your choosing. find-grep-dired matches all files but only
displays the ones that match a pattern passed to grep.
Microsoft Windows
Microsoft Windows has a choice of installing
cross-compiled binaries like GNUWin32 or
Cygwin or using find-lisp-find-dired.
The command find-lisp-find-dired is Emacs’s elisp imple-
mentation of find-dired. It works on any platform and re-
quire no external tools. In return, it is not as powerful. Also,
it uses Emacs’s regular expression engine, and not shell glob-
bing.
Shell Commands
As the chapter on dired demonstrated, there are powerful
commandsinEmacs thatinteractwiththe shell. For allother
buffers, there are the far more general, but equally powerful,
shell commands that work on generic buffers.
Keys
Description
M-!
Calls shell command and prints output
C-u M-!
As above, but inserts into buffer
311

## [p.312]
The Practicals of Emacs
Keys
Description
M-&
Like M-! but asynchronous
C-u M-&
Like C-u M-! but asynchronous
M-|
Pipes region to shell command
C-u M-|
Likes M-| but replaces region
You can invoke any shell command with M-! and Emacs will
print its output in the echo area, if the text is only a few lines
long; or a dedicated buffer called *Shell Command Output*
if you used M-!, and *Async Shell Command* if you used M-&.
Calling either command with a universal argument will in-
stead insert the output into your current buffer at the point.
The M-| command is far more practical. It takes the region
as input and sends it to the standard input of a shell com-
mand of your choosing and returns the output in much the
same way as M-!: either in the echo area or a dedicated buffer.
Calling the command with a universal argument, the active
region is replaced instead; that makes C-u M-| splendid for off-
hand calls to commands like uniq or other command line
tools that modify their input.
Although M-& is asynchronous – that is, it won’t block
Emacs until it terminates – it is a rather poor choice for
long-running tasks. It’s far better to use M-x compile.
Compiling in Emacs
Calling out to shell commands is meant for quick, one-off
commands. If you’re repeatedly running the same slew of
commands, you should consider Emacs’s M-x compile com-
312

## [p.313]
The Practicals of Emacs
mand that, despite its name, excels at more than just compi-
lation.
Commands
Description
M-x compile
Runs a command, and tracks errors
M-x recompile
Re-runs last command
M-g M-n, M-g M-p
Jumps to next/previous error (global)
g
Re-runs last command
C-x p c
Compile in the current project
When youinvoke M-x compile,youareaskedfora command
and Emacs kindly assumes you’re using make. However, you
are free to replace it with any command of which you want
to track the output: unit tests, compiling, running a script
— you name it.
The main advantage of M-x compile is its helper command
M-x recompile, as it re-runs your last command. Compile
also tracks errors thanks to its pattern matching engine.
Like M-x grep and M-x occur, the M-g M-n and M-g M-p
commands will jump through a call stack or compiler error
log provided their formatting matches one Emacs knows.
Everything from Python to most compilers are known to
Emacs, so it will probably work for yours too.
Shells in Emacs
Instead of using an external terminal emulator – or running
Emacs in a terminal just so you can use it with tmux or screen
– why not use Emacs as the “multiplexer” and use Emacs to
313

## [p.314]
The Practicals of Emacs
run your shell instead? Combined with TrAMP and Emacs’s
tiling window management and buffer support, you can re-
place almost all common use cases of dedicated terminal em-
ulators.
There are three ways of interacting with shells – like bash –
in Emacs. One is a simple wrapper around an external, exist-
ing shell (like bash) called M-x shell; another is a complete
shell implementation written in elisp called M-x eshell; and
the third is a terminal emulator called M-x ansi-term.
All three are very powerful and each attempts to solve the
problem in their own special way. Whichever one you use
(and you may well end up using more than one) comes with
a number of trade-offs.
All three, however, use elisp to either communicate with an
external program, or to implement a shell in Emacs, or to in-
terpret the terminal control codes needed to render complex,
interactive programs like top. All three also use Emacs’s pow-
erful buffer paradigm – that by now you are quite familiar
with – to provide a unified interface for all three implemen-
tations.
The buffer paradigm is especially powerful here as the abil-
ity to communicate with external programs or directly with
the operating system is part of what makes Emacs such a pow-
erful editor. You gain all the editing and movement com-
mands, and the power of elisp, in a buffer that is simultane-
ously used for more traditional things like text editing but
now also for far more advanced and specialized things like
interacting with bash. And because both extremes share a
common ground – the buffer – you don’t have to re-learn an
entirely new system; no more fretting with hand-selecting
314

## [p.315]
The Practicals of Emacs
text in a terminal emulator with a mouse just to copy it into
your text editor or web browser. In Emacs, it is all text and
all the movement and editing commands you are familiar
with work exactly the same here.
M-x shell: Shell Mode
Shell mode in Emacs calls out to an external program – such
as bash on Linux or cmd.exe on Windows – and either redi-
rects stdin, stdout and stderr on Windows, or through a
pseudo-terminal (on Linux) so you can interact with the un-
derlying shell through Emacs.
Because Emacs redirects I/O, you gain all the benefits and
downsides that go with that, however. For instance, you can-
not use your shell’s native TAB-completion mechanism. In-
stead, you have to use Emacs’s own (which is more power-
ful in some respects). The flip side to the coin is that a shell
mode buffer is entirely text: you can edit and delete output
from commands and you can kill and yank text to and from
the buffer with ease. That makes shell mode flexible but po-
larizing. Programs like top and man don’t work at all, or if
they do, they don’t work well.7
I personally use shell mode for almost all my command line
needs. I use very few interactive terminal programs and
when I need to I can use Emacs’s M-x ansi-term for proper
terminal emulation.
The upsides: free-form text editing and movement be-
cause shell mode is just a simple buffer outweighing the
7 Thankfully, you can use M-x proced and M-x man as replacements
for both.
315

## [p.316]
The Practicals of Emacs
downsides.
GNU readline and defaults
Most Linux distributions use GNU readline – a li-
brary – to provide basic command prompt func-
tionality, like: command history, search and re-
place, and advanced movement and editing. by
default, they’re accessible using Emacs key bind-
ings.
Here are some of the most common commands. Unfortu-
nately, they are all over the place in terms of bindings.
Keys
Description
M-p, M-n
Cycles through command history
C-<up>, C-<down>
Cycles through command history
M-r
ISearches history backward
C-c C-p, C-c C-n
Jumps to previous / next prompt
C-c C-s
Saves command output to file
C-c C-o
Deletes the last command output
C-u C-c C-o
Kills the last command output
C-c C-l
Lists command history
C-d
Deletes forward char or sends ^D
C-c C-z
Sends stop sub job
TAB
Completes at the point
Both M-p, M-n, C-<up> and C-<down> cycle through the com-
mand history in much the same way that using the up and
down arrow keys would in normal terminal emulators. In
316

## [p.317]
The Practicals of Emacs
Emacs, they literally move the point around in the buffer
though this always confuses people not used to shell mode.
M-r is triggers the history reverse Isearch. It’s a very power-
ful command that is worth learning. C-d deletes a character
ahead of the point, as it would anywhere else. However, if
there is no input (meaning you haven’t typed anything at a
prompt), Emacs will send the control code EOF to terminate
the running program. Similarly, C-c C-z does the same as
C-z in bash does for job control.
One nifty feature of shell mode is the ability to save the out-
put of the last command to a file with C-c C-s, and to send
it straight to your kill ring with C-c C-o.
TAB deserves its own special mention. Shells like bash feature
their own complex completion mechanisms, and not just for
files and paths. Emacs does too. You can complete things like
hostnames for commands like ssh or groups and owners for
chown.
M-x ansi-term: Terminal Emulator
Emacs has its own ANSI-capable terminal emulator. Invoking
M-x ansi-term and selecting a shell, you can run interactive
programs like top or even vim and emacs.
Its main downside is its slowness and some obscure terminal
emulation features are not supported.
Keys
Description
C-c C-j
Switches to line mode
C-c C-k
Switches to character mode
317

## [p.318]
The Practicals of Emacs
By default, ansi-term acts like a regular terminal emulator
and not like shell mode or a typical Emacs buffer. However,
you can switch between two different modes: line mode,
which is like a typical Emacs buffer; and character mode,
which is like a normal terminal emulator.
The default mode is character mode and that means most keys –
including keyboard characters, and not just Emacs key bind-
ings – are sent directly to the underlying shell program, by-
passing Emacs entirely. There is an escape character, C-c, that
Emacs intercepts so commands like C-c C-j and C-c C-k are
not sent to the sub-program. So if you want to send C-c to
the sub-program, you must type C-c C-c.
If you want the most faithful terminal experience in Emacs,
ANSI term is your best bet. I find the hassle of switching be-
tween line and character mode rather cumbersome so I pre-
fer to use shell mode instead.
M-x eshell: Emacs’s Shell
It shouldn’t come as much of a surprise that someone has
written an entire shell in elisp. When you run M-x eshell, you
are using a shell that is written in elisp, that communicates,
through Emacs, with the underlying host operating system
and provides an excellent facsimile to a typical Linux-style
bash shell, complete with elisp-emulated GNU coreutils com-
mands like ls, cp, cd, and many more.
In practice, that means you get a consistent shell across all
platforms on which Emacs runs. Combined with native
TrAMP support and the ability to redirect the output of
commands straight into an Emacs buffer, you have a tool
318

## [p.319]
The Practicals of Emacs
that is versatile, powerful and very much in the spirit of
Emacs.
Eshell is more akin to shell mode than ANSI term. It does not
support interactive programs like top, preferring instead to
open a dedicated M-x ansi-term instance to run those pro-
grams when you call them from Eshell — a clever and prag-
matic solution to the problem.
Another important difference is that although Eshell is
inspired by shells like bash, it is, in fact, its own shell
implementation with all the quirks, features and limitations
that go with it. It must be said that Eshell is an elisp shell
first and foremost, as every command you type into Eshell
is first filtered through Eshell’s own emulation layer, then
through Emacs’s own interactive commands, and then
finally through programs in your $PATH or in the current
directory. For instance, you can type dired . to open a
M-x dired session in the current directory, or find-file
todo.org to open
todo.org in your currently-running
Emacs.
319
