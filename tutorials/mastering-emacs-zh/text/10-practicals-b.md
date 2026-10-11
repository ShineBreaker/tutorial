# 实用篇（二）：Tramp、EWW

> 原书来源：Mastering Emacs (Eli Spare)，第 290–299 页。
> 覆盖范围：Tramp, EWW

## [p.290]
The Practicals of Emacs
Keys
Description
n, p
Page up / page down
<prior>, <next>
Page up / page down
SPC
Scroll down
S-SPC
Scroll up
M-<, M->
Jump to first / last page
+, -, 0
Enlarge, shrink or reset
W, H, P, F
Fit to width, height, page or window
This is but a small subset of available key bindings. Of note is
SPC and S-SPC as they slowly advance through the document,
and are intended for documents that you are reading. Use +
and - for zooming in or out. You can also let Emacs take
care of the guesswork with W or H to resize the document to
fit the width or height of the window. F, on the other hand,
will resize your window to fit the document.
If the images look pixelated, you can increase the DPI by cus-
tomizing doc-view-resolution.
Slide Show Viewer
The
command
M-x doc-view-presentation
turns a Doc View buffer into a full screen slide
show. You can navigate between “slides” with
n and p, and q to quit.
Tramp: Remote File Editing
Remote file editing is usually awkward: you have to interact
with a remote environment, usually using a terminal emula-
290

## [p.291]
The Practicals of Emacs
tor, and almost always without the fidelity of a graphical
interface and your usual settings. Even though it’s trivial to
move your .emacs.d around with you, it is still awkward. For
all the improvements in technology, remote file editing usu-
ally involves trade-offs.
Emacs’s TrAMP6 system is a transparent proxy that aims to
solve most of the remote file interaction woes you are likely
to encounter. TrAMP is, without a doubt, the coolest feature in
Emacs.
TrAMP works by monitoring C-x C-f (and other commands)
and it detects when you try to access remote files using a spe-
cial syntax not unlike what command line tools such as scp
use. What makes TrAMP great is its total transparency. If you
didn’t know Emacs had remote editing capabilities, you’d
never know. It is quick and seamless to reach out and edit
remote files.
All TrAMP connections follow this syntax:
/protocol:[user@]hostname[#port]:
TrAMP supports many protocols – both old and new – but
nowadays the one you are most likely to use is ssh or maybe
scp. For a full list of TrAMP protocols and how they work,
consult the variable tramp-methods or the info manual page
(tramp) Inline methods.
Microsoft Windows
6 Transparent Remote (file) Access, Multiple Protocol
291

## [p.292]
The Practicals of Emacs
On Windows, your protocol choices differ. If
you don’t use Cygwin or a cross-compiled
version of OpenSSH, you will need to install
PuTTY’s plink.exe tool and use plink as the
protocol.
Although the server landscape is a lot more homogeneous
today than it was 25 years ago, TrAMP does a lot of behind-
the-scenes work to ensure the remote shell delivers a consis-
tent (and dependable) experience. The variable I mentioned
above, tramp-methods, controls how TrAMP handles each pro-
tocol type. If you work with obscure systems, you may have
to customize this variable.
Another nifty feature of TrAMP is that it parses your
~/.ssh/config file and autocompletes known hosts when
you have entered ssh as your protocol. You can, of course,
specify both a hostname, username, and port manually,
with the latter two being optional.
SSH config
If you use ssh, I strongly suggest you use the
configuration file as you can store all the connec-
tion and credential details in an easy to remem-
ber name.
For more information, type M-x man ssh_config
to read the relevant manual page in Emacs.
Finally, to actually invoke TrAMP you must call it from the
root – typing // in FIDO or IDO mode will jump to the root –
and follow the format as above.
292

## [p.293]
The Practicals of Emacs
Helm
If you also use Helm, you can install a third-
party package called
helm-tramp that auto
generates all reasonable TrAMP configurations
you may want to use. You can also find TrAMP
extensions that add support for tools like
Docker.
Note that Emacs will not initiate a remote connection until
you enter the second :, like so:
/ssh:homer@powerplant:/var/log/reactor.log
The command above connects to the server powerplant us-
ing ssh as the protocol and homer as the user. It then opens
the file /var/log/reactor.log.
The Default Directory and Remote Editing
Every buffer has a default-directory variable. The vari-
able, in elisp terms, is buffer local. Each buffer has its own
default-directory variable as it is local to just that buffer
and not global (like variables are by default in Emacs).
When you type
C-x C-f in a buffer, Emacs looks to
default-directory and picks that directory as the default
one for opening new files. That is sensible as you may want
to open other files that share a directory with the current
buffer. Typing C-x C-f while editing a file in /etc means
you may want to open another file in /etc, so Emacs picks
that as your default directory.
293

## [p.294]
The Practicals of Emacs
This feature works identically with TrAMP and remote files.
Invoking C-x C-f in a remotely-edited file and Emacs auto-
matically queries the remote system and not your local one,
letting you easily open other remote files.
When you have opened a file, TrAMP does its magic behind-
the-scenes and you’ll end up with a file in Emacs that looks
and seems much like a local one. The only visible way of
telling that a file is remote is the modeline: a @ appears be-
fore the file name and default-directory reflects the TrAMP-
annotated file path; try it, inspect the variable with C-h v.
So, you can edit files remotely, but because of the tight
integration between TrAMP and Emacs you can do so much
more. Invoking commands like M-x rgrep works seamlessly
with Emacs and TrAMP. The command is run on the remote
machine and the results are fed back to Emacs as though
you’d called the command locally.
There is no end to the things you can call remotely. Here are
some of the commands that I use remotely:
C-x d: Dired All commands are tunnelled through the re-
mote session so you can manage your files and directo-
ries with dired as though they were local.
You can even copy files between remote and local
dired sessions and TrAMP will transparently copy the
files across.
M-x compile: Compile You can enter a compile command,
such as
make or
python manage.py runserver, or
indeed anything you like. Emacs runs the command
remotely and the output is shown in the *compilation*
294

## [p.295]
The Practicals of Emacs
buffer. You can even run interactive servers remotely
with live feedback.
M-x rgrep: Grep Commands Both find and grep are called
remotely and, as with the other commands, the results
are displayed in Emacs. Hyperlinked files in the grep
output correctly open the remote file.
M-x shell: Emacs’s Shell Wrapper Starts a remote login
shell and hands you control of it. It works just like
M-x shell on a local machine but the shell in this case
is, obviously, on the remote machine. TAB-completion
– which in M-x shell is done by Emacs and not the
actual shell – also works.
M-x eshell: EShell, Emacs’s elisp shell Eshell is a shell
written in Emacs lisp. It also transparently works
with remote TrAMP connections. In fact, you can cd
into remote directories straight from a local shell.
Multi-Hops and User Switching
Another cool ability of TrAMP is account elevation with su
or sudo. This is works even for local files if you want to edit
a file as another user or root.
The ability to do this also neatly ties in with the concept
of multi-hops: connecting to a remote host through interme-
diate hosts. An example is if you have to access an internal
server but first have to connect through a public server for
added security; another is if you have to log in as one user
but then have to call out to sudo to edit a file as root on a
remote server.
295

## [p.296]
The Practicals of Emacs
Let’s start out with the simpler case of requesting sudo access
to /etc/fstab:
/sudo:root@localhost:/etc/fstab
As you can see, the syntax is identical to a normal remote
TrAMP connection — only we’re using sudo and we are con-
necting locally. You can usually omit root@ as TrAMP is clever
enough to guess it’s root. Keep in mind that this file is tech-
nically remote (in the TrAMP sense) so the usual rules about
default-directory apply. Opening files with C-x C-f in a re-
mote buffer will open other files as sudo.
Multi-hopping in TrAMP is usually done by customizing
tramp-default-proxies-alist but I find it a bit fiddly; the
ad hoc syntax is much easier:
/ssh:homer@powerplant|sudo:powerplant:/root/salary.txt
The example above connects to
powerplant as
homer.
Then, another ‘connection’ invokes
sudo and opens
/root/salary.txt as a sudo’d user. It is very important that
you repeat the hostname in the sudo string or it will not
work. As before, remote files obey the same rules as earlier.
Commands like M-x shell will give you a root shell on
powerplant if invoked from the salary file.
Bookmarks
You can bookmark (see Bookmarks and Regis-
ters) remote files with C-x r m and TrAMP will
296

## [p.297]
The Practicals of Emacs
automatically reconnect if you re-open a book-
mark later with C-x r b or C-x r l. Bookmarks
work with a large range of Emacs’s many features.
Here they’re also a great time saver, especially
for complex multi-hops.
Finally, I recommend you add this snippet to your init file. It
is a custom command that, when invoked as M-x sudo, uses
TrAMP to edit the current file as root:
(defun sudo ()
"Use TRAMP to `sudo' the current buffer."
(interactive)
(when buffer-file-name
(find-alternate-file
(concat "/sudo:root@localhost:"
buffer-file-name))))
From the above, it’s easy to tweak the string and build multi-
hopped commands — if you are new to elisp and you need
multi-hops, consider it a fun first place to start learning.
Conclusion TrAMP, in conjunction with Emacs’s built-in
shell support, and its windows and buffers, make it a
fine replacement for tmux & GNU screen-based work
flows. By keeping the remote file editing inside Emacs,
you unify your environment and you greatly lessen
the mental context switching of having disparate
Emacs sessions. TrAMP is a really powerful feature
in Emacs and one that is worth using over other
297

## [p.298]
The Practicals of Emacs
alternatives — it’ll never completely replace the
incumbent methods of remote editing but it’s a good
place to start.
EWW: Emacs Web Wowser
Long ago Emacs succumbed to Zawinski’s Law of Software
Envelopment that states, “Every program attempts to expand
until it can read mail. Those programs which cannot so ex-
pand are replaced by ones which can”, by having not one,
but many, mail clients built in.
Clearly, for the twenty-first century, we need to raise the
bar. So it should come as no great surprise that Emacs has a
built-in web browser, EWW — the Emacs Web Wowser.
EWW is a nifty, little browser engine. Its renderer is limited
to basic HTML and image support so it is not terribly differ-
ent from existing text-based browsers. However, despite its
limited renderer, it is excellent for perusing technical docu-
mentation, quick web searches, and browsing web sites you
don’t want your boss to see.
To use EWW, simply type M-x eww and you are prompted
for an UrL or a search term. By default, the search engine
is DuckDuckGo, but you can Customize eww-search-prefix
and change it to something else. Starting with Emacs 27,
typing C-u M-x eww will create a new EWW buffer even if
one already exists.
External and internal browsing
298

## [p.299]
The Practicals of Emacs
You
can
instruct
Emacs
to
open
things
in
a
web
browser
with
the
command
M-x browse-url.
Emacs
will
use
the
vari-
able
browse-url-default-browser, a function
that will attempt to guess the right browser to
use depending on your operating system and
installed browser.
You
can
customize
the
default
browserbytyping M-x customize-option
browse-url-default-browser.
Navigation in EWW is mostly through the keyboard (as you
would expect from Emacs) but hyperlinks are clickable with
a mouse.
Keys
Description
TAB, S-TAB
Cycle to next/prev hyperlink
q
Quit EWW
&
Open page with M-x browse-url
B
Show bookmarks
b
Add bookmark
H
Show browser history
l, r
Browse backward / forward in history
p, n, u, t
Semantic web navigation aids
R
Enable Reader mode
RET
Browse link
C-u RET
Open link in external browser
M-s M-w
Searches for region in EWW
M-RET
Open link in new buffer
s
Switch to another EWW buffer
299
