# 编辑理论（一）：杀死/粘贴、转置、填充、注释

> 原书来源：Mastering Emacs (Eli Spare)，第 190–208 页。
> 覆盖范围：Killing and Yanking, Transposing, Filling and Commenting

## [p.190]
Chapter 5
The Theory of Editing
“An infinite number of monkeys typing into
GNU Emacs would never make a good program.”
– Linus Torvalds, Linux Kernel Coding Style Docu-
mentation
Editing in Emacs is perhaps even easier than learning how
to move around effectively in Emacs. Most day-to-day edit-
ing is writing or deleting text punctuated by specialist com-
mands. Nevertheless, in Emacs, even mundane things like
deleting text or using the kill ring (the clipboard) are highly
optimized.
I think it’s more important that you master movement
first as that means you learn how to switch buffers and use
Emacs’s windowing system effectively. That is why I have
not talked about editing text at all, until now, two thirds
of the way through the book. Once you’re comfortable
opening and saving files and getting around in Emacs
190

## [p.191]
The Theory of Editing
without losing track of what you were doing — then
you’re ready to tackle more advanced editing concepts.
If you are reading this chapter and are still using the naviga-
tion keys – the arrow keys, page up and down, and so on –
then that is fine too. You will find the experience a bit dis-
jointed as a lot of what makes Emacs’s movement keys so ef-
fective is the near-harmonious relationship they have with
their text-editing .
This chapter will cover how to edit text. That includes tra-
ditional staples like search and replace; how to use the kill
ring, or clipboard; how to use text macros; and how to use
text transformation tools.
Killing and Yanking Text
Where other text editors merely cut text, in Emacs you kill it.
The terminology, as I talked about in Killing, Yanking and
CUA, is bizarre and predates most graphical user interfaces
entirely.
Discovering the Kill Commands
Use Emacs’s apropos functionality to find
additional kill commands not listed here.
Emacs’s kill commands use the same syntactic unit concept as
the movement commands do. Some of them also share mod-
ifier symmetry, making it easy to switch between kill com-
mands.
191

## [p.192]
The Theory of Editing
Key Binding
Purpose
C-d, DEL
Delete character
<backspace>
Delete previous character
M-d, C-<backspace>
Kill word
C-k
Kill rest of line
M-k
Kill sentence
C-M-k
Kill s-expression
C-S-<backspace>
Kill current line
The ones that stand out in the table above are C-d (and DEL, in
the navigation cluster above your arrow keys), which deletes
the next character; and <backspace>, which does the same
but backwards. All other commands kill and don’t delete. The
distinction is important: deleted text is not retained in your
kill ring whereas killed text is.
Digit Arguments and Negative Arguments Like
the
movement commands, you can use the digit ar-
guments to kill more than one unit at a time. To
maintain your tempo, ensure you use the same digit
modifier as the modifier of the kill command you
want to call. If you want to kill 3 s-expressions with
C-M-k, type C-M-3 C-M-k.
The negative argument reverses direction, just like
the movement commands. Make no mistake: that
is more practical than it seems. I frequently finish
writing something only to realize I want to move it
elsewhere or, perhaps, delete it entirely.
Consider this example:
192

## [p.193]
The Theory of Editing
s = make_upper_case("hello, world!"█)
After C-M-- C-M-k:
s = make_upper_case(█)
Emacs has a number of generalized kill and yank commands
also. They’re worth memorizing, as you will use them fre-
quently:
Key Binding
Kill Ring Purpose
Clipboard
C-w
Kill active region
cut
M-w
Copy to kill ring
copy
C-M-w
Append kill
C-y
Yank last kill
paste
M-y
Cycle through kill ring,
replacing yanked text.
Maybe show kill ring history
(Emacs 28)
Killing versus Deleting
The difference between killing and deleting trips up a lot of
new Emacs users. In most editors, there is a clear delineation
between clipboard commands – that act solely and exclu-
sively on the selected text – and commands that delete text.
In Emacs, all commands will, with few exceptions like C-d,
DEL and <backspace>, kill text straight to your kill ring. If
you are new to Emacs, it will confuse you and maybe even
infuriate you. No other editor fiddles with your clipboard
193

## [p.194]
The Theory of Editing
content unless you explicitly tell it to — but Emacs does,
and it’s a great feature once you get used to it.
Emacs’s kill commands are best summarized with five simple
rules:
Consecutive kills append All kill commands append to
the kill ring – that is to say they append to the text
in the kill ring – if, and only if, the last command
was also a kill command. If you break the cycle, by
moving or writing or running a command, the next
kill command will create a new entry in the kill ring.
For instance, if you type M-d M-d M-d – killing three
words in a row – your kill ring will hold the three
words you killed when you next yank the text. If you
type M-d M-d M-d, then move to the next line with C-n
and kill another three words. Your last three words are
whatyouyankfromthekillring,notallsix!Themove-
ment command broke the cycle.
It will take you a little while to get used to this. But it’s
a smarter way of working as you don’t have to select
text first.
The kill ring can hold many items Much like the undo
ring you cannot easily lose information in the kill ring.
If you kill something and then later on replace your
first kill entry with another kill, you have not lost
your first kill. It’s easily recoverable and in fact the
kill ring is often used as a temporary and secondary
“store” of snippets if you are rewriting text.
194

## [p.195]
The Theory of Editing
The kill ring does have a maximum size – or rather
how many cells of text it holds before it silently drops
the oldest ones – and you can customize it by altering
kill-ring-max. I have never really had the need to my-
self, though, as the default is generous.
The kill ring is global It’s shared between all the buffers in
Emacs. Every item in the kill ring is available to you
everywhere.
Killing is also deleting When I started my Emacs journey,
I found it strange that there were no dedicated delete
commands. But that’s because the kill ring is as
much a dumping ground for unwanted text as it is
a clipboard for useful text. There are few outright
commands that delete text – Emacs will rarely put you
in a position where accidental data loss is likely – so
that’s why all bound commands send text to the kill
ring instead. But that’s fine too: the kill ring is finite,
but larger than you would ever likely care about.
Forget the idea that your kill ring is precious — it’s
not.
Marking is unnecessary Whether it’s code or prose, you
will find that most of the work you do involve opera-
tions on syntactic units. It’s far quicker to tap M-d three
times in a row to kill three words than to mark them
first with M-@ and then kill with C-w.
There are two exceptions, though:
• If you want to copy (M-w) the region, it’s quicker
to mark first and then copy.
195

## [p.196]
The Theory of Editing
• If you want to kill or copy odd-shaped regions
that don’t conform to multiples of syntactic
units.
Appending to the kill ring
Occasionally, you want to append a new kill to
the existing one in the kill ring. This often hap-
pens if you want to kill different parts of a buffer
that are not one, contiguous region or series of
kill commands. To do this, first type C-M-w and
Emacs will tell you in the echo area that if the
next command is a kill command, it will append
to the kill ring.
Killing Lines
If you want to kill the whole line, you should use
C-S-<backspace> — but that command won’t work in a
terminal as it is not possible owing to technical limitations
of the terminal emulator.
The other approach, and the one I use myself, is to mod-
ify the behavior of C-w – the command that kills the active
region – so it kills the current line the point is on if the
region is not active. I recommend you install the package
whole-line-or-region if you want your Emacs to do this
also:
M-x package-install whole-line-or-region
Similarly, there is C-k, which kills to the end of the line. The
behavior is different from what most expect: C-k will not kill
196

## [p.197]
The Theory of Editing
the newline character at the end of the line. This is a feature
and not a bug. The newline character is rarely desired when
you want to yank the text somewhere else: if you didn’t, you
now have a spare newline in your kill ring, and you’re miss-
ing one in your buffer. Contrarily, if the point is at the end
of the line, only the newline symbol is killed. Therefore, tap-
ping C-k twice will kill the text and the newline, making it
easy to include both in the same cell of text when you do
want the newline.
If you prefer, you can force C-k to kill the newline perma-
nently by customizing the option kill-whole-line. But I
would encourage you to try the default before you make the
change.
Yanking Text
In Emacs, you yank from the kill ring if you want to paste
text from it.
Terminology
Paste is not a widely-used term in Emacs. How-
ever, as it’s so common elsewhere – along with
a handful of other words – Emacs will treat it as
a synonym of yank when you use apropos.
The two yank commands you want to know about are:
Key Binding
Purpose
Clipboard
C-y
Yank last kill
paste
M-y
Cycle through kill ring,
197

## [p.198]
The Theory of Editing
Key Binding
Purpose
Clipboard
replacing yanked text.
Maybe show kill ring history
(Emacs 28)
Yanking works as you would expect: it inserts the current
entry in the kill ring at point in your active buffer. Repeat
calls to yank will insert the same text.
As I mentioned before, the kill ring is a ring, like the undo
ring, and it remembers former kills so you can cycle through
them.
Cycling through the kill ring is easy:
1. Press C-y where you want the yanked text to appear.
2. Without executing another command – this includes
movingaroundandeditingtext–type M-ytostepback
through Emacs’s kill ring.
AsofEmacs28youcanbrowsethekillringwith M-yandpick
the kill ring entry to yank. This feature is only available if
you haven’t just called yank with C-y — in other words, the
default operation of M-y is to show the kill ring history.
Transposing Text
Transposingtextisthe act ofswappingtwosyntacticunitsof
text with one another. At first glance you may think they are
of limited utility; but actually they solve a real problem, and
198

## [p.199]
The Theory of Editing
if you spend the effort and master them, you will not regret
it. Switching the order of words in prose, or the arguments
in a function call, is a frequent occurrence.
When you transpose text, you do so using syntactic units in
much the same way you move or kill text:
Key Binding
Purpose
C-t
Transpose characters
M-t
Transpose words
C-M-t
Transpose s-expressions
C-x C-t
Transpose lines
M-x transpose-paragraphs
Transpose paragraphs
M-x transpose-sentences
Transpose sentences
When you call a transpose command, Emacs will first look
at where the point is and, depending on the exact transpose
command you issued, swap two syntactic units surrounding
the point.
How Emacs defines a syntactic unit in this case is a bit compli-
cated as your major mode determines what a syntactic unit
is.
Negative arguments also work; so do digit arguments, but
not the way you would expect. When you give a digit argu-
ment to a transpose command it will get the Nth unit ahead
of the point (unless you also give it a negative argument, in
that case it is the other way around) and swap that unit with
the one immediately before the point.
199

## [p.200]
The Theory of Editing
C-t: Transpose Characters
Transposing a character takes the character to the left and
right of the point and swaps them:
A█BC
After C-t:
BA█C
Note that the point moved forward one character so you can
repeat calls to C-t to “pull” the character to the right:
BCA█
One important exception to this rule is when you are at the
end of a line. C-t will swap the two characters to the left of the
point:
BCA█
After C-t:
BAC█
This asymmetry is a keen way of fixing typos as they oc-
cur. Fixing mistyped characters with C-t is a time saver as
it saves you the effort of deleting both characters and retyp-
ing them.
200

## [p.201]
The Theory of Editing
M-t: Transpose Words
Transposing two words with M-t works as you would expect
when the words are plain text, like this:
Hello █World
After M-t:
World Hello█
Like transposing a character with C-t, the point moves for-
ward as though you had typed M-f (M-x forward-word) and
that means you can “pull” a word to the right.
Where M-t really shines is when you use it with source code.
In What Constitutes a Word? the M-f and M-b movement
commands ignore symbols in the direction you are moving
in and M-t behaves the same way.
Consider this example Python code where we have a dictio-
nary (a key-value hash map):
names = {
'Jerry':█'Seinfeld',
'Cosmo': 'Kramer',
}
With the point between the key and value, a call to M-t is
pure magic:
201

## [p.202]
The Theory of Editing
names = {
'Seinfeld': 'Jerry',
'Cosmo': 'Kramer',
}
As you can see, the key and value swapped places but the
symbols remained in place. Repeat it again and Emacs will
continue and swap Jerry with Cosmo; repeat it once more
and you swap Jerry and Kramer.
How Transposing Actually Works
The M-t command is intrinsically linked to the
M-x forward-word (M-f) command. Greatly sim-
plified, Emacs will call M-f two times: once with
a negative argument, to get the left-side word
to transpose; and once again without a negative
argument, to get the right-side word to trans-
pose. The reality is a little more complicated but
not by much. It’s also an easy theory to test: call
M-- M-f and M-f from your original position –
making sure to move the point back to the origi-
nal position between the calls – and you will find
the left and right edge of the words M-t will trans-
pose.
If Emacs’s word movement behavior made no sense before, I
hope it makes a bit more sense now. It’s not to everyone’s lik-
ing but it is consistent across movement, kill and transpose.
It also works on prose:
202

## [p.203]
The Theory of Editing
Hello,█World!
After M-t:
World, Hello█!
C-M-t: Transpose S-expressions
You can transpose s-expressions – balanced expressions
– with C-M-t and, like word transposition with M-t, the
mechanics are identical; the same forward & backward
principles apply when the transposition function finds the
left and right edges.
Consider the following piece of LISP code:
(/ (+ 2 n)█(* 4 n))
Calling C-M-t on it will swap the two forms’ positions:
(/ (* 4 n) (+ 2 n)█)
Like M-t from before, the concept is identical but the applica-
tion differs. But C-M-t, much like M-x forward-sexp (C-M-f),
assumes the role of M-x transpose-word if there are no bal-
anced expressions:
Hello,█World!
And after C-M-t it becomes:
203

## [p.204]
The Theory of Editing
World, Hello█!
But consider what happens if we mix a balanced expression
with a word:
Hello,█(insert name here)!
After C-M-t:
(insert name here), Hello█!
So, C-M-t still works as you would expect. The applicability
is apparent in code as well:
ages = {
'Seinfeld':█34,
}
As you would expect, Emacs transposes things correctly:
ages = {
34: 'Seinfeld'█,
}
The behavior is different compared with M-t. Consider the
same scenario as before but with M-t:
ages = {
'34': Seinfeld█,
}
204

## [p.205]
The Theory of Editing
The result is different indeed. Emacs did indeed swap the
words but left the symbols intact. This is consistent with how
Emacs treats words and word boundaries.
Other Transpose Commands
You can also transpose other syntactic units – lines, para-
graphs and sentences – and aside from transposing lines the
rest are harder, I think, to justify learning right away. The
paragraph and sentence commands are unbound, making
them harder to use — the only way to use them is to invoke
them through M-x.
Transposing lines with C-x C-t does have a use, however. I
use it frequently to re-order newline-based lists, and I find
it has its place in programming also.
Filling and Commenting
Filling
If you write a lot of text, you occasionally have to manually
break paragraphs so the lines won’t exceed a certain length.
You can use Emacs’s fill functionality to do this for you, ei-
ther manually or automatically as you write. The fill com-
mand is for more than just text. For instance, you can fill
comments or doc strings too so they fit in under 80 charac-
ters.
Key Binding
Purpose
M-q
Refill the paragraph
205

## [p.206]
The Theory of Editing
Key Binding
Purpose
C-x f
Sets the fill column width
C-x .
Sets the fill prefix
M-x auto-fill-mode
Toggles auto-filling
I use paragraph filling, using M-q, often as I write comments
in code and it is common for major modes to set a fill width
(C-x f) with the best practices used for that programming
language or file type.
Consider this quote by Sherlock Holmes that overruns the
page:
'It is an old maxim of mine that when you […]
After placing the point in the paragraph and typing M-q:
'It is an old maxim of mine that when you
have excluded the impossible, whatever
remains, however improbable, must be the
truth.'
If you type M-q with the prefix C-u, Emacs will attempt to
justify the text also:
'It is an old maxim
of mine that when you
have
excluded
the
impossible,
whatever
remains, however
improbable, must
be the
truth.'
206

## [p.207]
The Theory of Editing
Typing C-x f will prompt you for a fill width. As an exam-
ple, for the quotes above I put the point on the column I
wanted the paragraph broken and pressed C-x f — approxi-
mately 42 characters. The fill width is the number of charac-
ters per line, but Emacs will not hyphenate words, so don’t
make the fill width too small or it won’t fill properly.
The fill prefix is an interesting feature. When you type C-x .,
Emacs will take every character on the current line up to point
and make it the fill prefix. A fill prefix is, as the name implies,
inserted before the lines when you fill a paragraph with M-q.
To remove the fill prefix, place your point on an empty line
and type C-x ..
You can tell Emacs to automatically fill text as you write by
enabling M-x auto-fill-mode. I wouldn’t use it in program-
ming modes (it doesn’t work well) and limit its use to text
modes.
Commenting
Inserting comments in code is something Emacs is more
than capable of doing. It does come with a few different key
bindings and commands, with each one serving a slightly
different use case.
Key Binding
Purpose
M-;
Comment or uncomment DWIM1
C-x C-;
Comment or uncomment line
M-x comment-box
Comments the region but as a box
1 DWIM stands for Do What I Mean — another way of saying Emacs
will try to guess what you want to do.
207

## [p.208]
The Theory of Editing
Key Binding
Purpose
M-j, C-M-j
Inserts new line and continues
with comment on a new line
The two you are most likely to use for in situ commenting
are M-; and C-x C-;. If you type M-;, Emacs will insert a com-
ment at the end of the line the point is on, and if you’re on
an empty line, Emacs will indent the comment according to
the major mode’s indentation rules.
If you have a region active, M-; will toggle between com-
menting and uncommenting it. The command C-x C-; tog-
glescommentsonthewholelinethepointison. C-x C-;also
works with a negative and digit argument.
Typing M-j or C-M-j with your point in a comment makes
Emacsbreakthelineandinsertanewcomment.Inthatsense,
it is identical to fill prefix. This command works well if you
write a lot of doc strings as Emacs is generally smart enough
to recognize comment prefixes that some doc string formats
require.
It bears mentioning that the Emacs fill commands I talked
about earlier understand and respect comment syntax so feel
free to use M-q in a comment.
If you are using the comment commands in a major mode
that does not have the requisite comment variables set up (see
table below), Emacs will ask you for a comment character to
use when you first run the command.
208
