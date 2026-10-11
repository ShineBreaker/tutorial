;;; check-keys.el --- 用真实的 Emacs 内核核对本书断言的按键与命令 -*- lexical-binding: t; -*-

;; 用法: emacs --batch -Q -l tools/check-keys.el <keys.json 的路径>
;; 输入 JSON: {"keys": ["C-x C-f", ...], "commands": ["find-file", ...]}
;; 输出: 每行一条 UNBOUND-KEY / UNDEFINED-CMD / SUMMARY 记录, 供 tools/check-keys.py 解析。

(require 'json)

(let* ((arg-path (car command-line-args-left))
       (data (if arg-path
                (with-temp-buffer
                  (insert-file-contents arg-path)
                  (goto-char (point-min))
                  (let ((json-object-type 'alist)
                        (json-array-type 'vector)
                        (json-key-type 'symbol))
                    (json-read)))
              nil))
       (key-list (append (alist-get 'keys data) nil))
       (cmd-list (append (alist-get 'commands data) nil))
       (bad-keys nil)
       (bad-cmds nil))

  (unless data
    (message "check-keys: 未能读取输入 JSON: %s" (or arg-path "(无参数)"))
    (kill-emacs 3))

  (dolist (k key-list)
    (let ((binding (condition-case nil (key-binding (kbd (format "%s" k))) (error :bad))))
      (unless binding (push k bad-keys))))

  (dolist (c cmd-list)
    (unless (fboundp (intern-soft (format "%s" c)))
      (push c bad-cmds)))

  (dolist (k (reverse bad-keys))
    (princ (format "UNBOUND-KEY\t%s\n" k)))
  (dolist (c (reverse bad-cmds))
    (princ (format "UNDEFINED-CMD\t%s\n" c)))
  (princ (format "SUMMARY\tchecked-keys=%d\tunbound=%d\tchecked-cmds=%d\tundefined=%d\n"
                 (length key-list) (length bad-keys)
                 (length cmd-list) (length bad-cmds)))
)

;;; check-keys.el ends here
