# 结语与延伸资源

> 原书来源：Mastering Emacs (Eli Spare)，第 320–326 页。
> 覆盖范围：Conclusion, Other Resources, Third-Party Packages, Communities

## [p.320]
Chapter 7
Conclusion
“Emacs is the ground. We run around and act
silly on top of it, and when we die, may our rem-
nants grace its ongoing incrementation.”
– Thien-Thi Nguyen, comp.emacs.
How do you master a text editor as diverse as Emacs?
The answer, surprisingly, is simple: by knowing how to ask
it the right questions. As I talked about in Emacs as an Op-
erating System, the very fabric of Emacs is modifiable and
extensible through elisp. So, the only way to truly under-
stand what happens in Emacs is to ask it — simple, but true.
And asking Emacs is what all Emacs masters do. Whether
it is to check what a key is bound to or what exactly a com-
mand does, it is part and parcel of what defines Emacs mastery.
Yes, knowledge of elisp is a big help but it is not an absolute
requirement.
320

## [p.321]
Conclusion
Throughout this book, I have written about features and
functions and my own personal views on what is worth fo-
cusing on and what isn’t. That is the truly practical, overar-
ching aspect to this book. The deeper lesson – and what was
ultimately the linchpin moment for me when I first started
learning Emacs – is understanding how to ask Emacs questions.
Not remembering a key or a command is perfectly natural,
especially when you’re still learning, but knowing that
Emacs can tell you what it does, even if you have heavily
modified or altered your key bindings, is what will ulti-
mately help you truly master Emacs. Forgetting what C-x
r l does is immaterial when you can use C-h k to find out;
and partially remembering what something does is also not
important when you can append C-h to any prefix key to
describe all the keys bound to it.
The long-term goal of any Emacs user is to reach a point
where they can seek answers to questions they have by ask-
ing Emacs. Eventually, you’ll commit to muscle memory
the commands and keys you use most frequently, and the
rest, well, you can always look them up.
Use Emacs long enough – and those of you who have
reached this point already will probably agree with me –
and one day it just clicks. And when it does, it’s not because
you have managed to memorize a thousand key bindings.
It’s because Emacs is no longer an opaque box but a very
open and transparent one that you can peer into, modify
and observe the results of those changes.
The reading order of this book is presented in the same way
that I would teach someone Emacs if they sat next to me. Un-
derstanding the terminology is important as it lays a founda-
321

## [p.322]
Conclusion
tion; next is the most basic of keys and commands so you
can use Emacs; and then comes the movement and editing
commands, followed by some practical examples to help re-
inforce what you have learned and to give you some ideas
on where to go from there.
Finally,Iwanttotouchonwhatyoushoulddoonceyoufeel
you have nothing more to learn from this book. The natural
next step is learn elisp; it’s a fun language, even if the LISP di-
alect lacks a lot of the bells and whistles of more modern
LISPs. Learn LISP and you’ll appreciate why curmudgeonly
old-timers decry “modern” programming languages as infe-
rior versions of LISP — and they’re half-right, too. Once you
see LISP’s data-as-code concept in action – and you will as it
is used everywhere in Emacs – you’ll wonder why you never
learned it earlier.
Further Reading My own blog, Mastering Emacs, is full
of in depth articles that you should consider reading
next. A lot of the third-party packages like IDO mode
or Emacs’s Eshell are described in far greater detail on
the website.
https://www.masteringemacs.org/
Other Resources
Third-Party Packages and Tools
I use many third-party packages myself. Here’s just a short
list of some of the ones I find most interesting.
322

## [p.323]
Conclusion
• nov, an excellent EPUB reader for Emacs that you
should use to read this very book.
https://depp.brause.cc/nov.el/
• Magit, an excellent Git UI with a unique chord-based
key system.
https://www.magit.vc
• Multiple Cursors, a way of inserting multiple points
in your buffer to facilitate parallel editing.
https://github.com/magnars/multiple-cursors.el
• LSP mode is an alternative to Eglot. Unlike Eglot, LSP
mode tries to recreate the sort of complete IDE experi-
ence you get in other editors.
https://github.com/emacs-lsp/lsp-mode
• Helm, a powerful completion framework with many
built-in completers
https://emacs-helm.github.io/helm/
• Flycheck, a generic framework for linting and syntax
error checker your code. Comes pre-configured
dozens of tools. If you’re using Eglot, the builtin
Flymake tool is all you need.
https://www.flycheck.org/en/latest/
• OrG mode, an exceptional organizer, diary and agenda
manager, literate programming tool, and more. It’s
built in, but you should definitely visit the website
and read their manual.
https://orgmode.org/
323

## [p.324]
Conclusion
• GNU Hyperbole
An advanced, yet easy-to-use, hypertext outliner, or-
ganizer and productivity suite. It plugs into OrG mode
and works well alongside it.
If you’re even remotely organized, I recommend you
check it out. Start by watching the Hyperbole videos
on the website.
https://www.gnu.org/software/hyperbole/
• YASnippet, a text snippet expansion tool.
http://joaotavora.github.io/yasnippet/
• Hydra, a package that lets you build flexible popup UIs
for key bindings.
https://github.com/abo-abo/hydra
• dumb-jump, jumps to definitions from symbols under
point. Infers the project and types of files and defini-
tions to search for automatically. Good enough for
95% of use cases or when your LSP is not enough. Com-
bine it with ripgrep for even faster searching.
https://github.com/jacktasia/dumb-jump
For tools, I recommended ripgrep several times as it’s so fast.
It also supports many different file formats by default, includ-
ing OrG mode.
324

## [p.325]
Conclusion
Communities
There are many community sites and blogs on the Internet.
Here is a non-exhaustive list of some of the ones I recom-
mend.
Reddit There is a lively community of Emacs users on the
subreddit /r/emacs. Since I wrote the book in 2015,
the community has grown tremendously.
You can also find specialized subreddits for particular
areas of Emacs. /r/orgmode is also worth visiting.
StackExchange Emacs now has its own site on StackEx-
change:
https://emacs.stackexchange.com/
It is another great place to ask questions.
Blogs There are many excellent Emacs blogs nowadays. I
like the following:
• Sacha Chua
https://sachachua.com/blog/
• Irreal’s Emacs blog
https://irreal.org/blog/
• Artur Malabarba
https://endlessparentheses.com/
• Bozhidar Batzov
https://batsov.com/
• John Kitchin
https://kitchingroup.cheme.cmu.edu/blog/
325

## [p.326]
Conclusion
However, almost all of the blogs above – and many
more – are found on the excellent Planet Emacs aggre-
gator:
https://planet.emacslife.com/
Emacs And then there’s Emacs. It is, and always will be, the
authoritative source of information for your Emacs.
326
