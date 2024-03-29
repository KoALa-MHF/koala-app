import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Comment } from '../../types/comment.entity';
import { AnnotationTextCommentComponent } from '../annotation-text-comment/annotation-text-comment.component';

export interface CreateAnnotationTextComment {
  annotationId: number;
  text: string;
}

@Component({
  selector: 'koala-annotation-text-comment-list',
  templateUrl: './annotation-text-comment-list.component.html',
  styleUrls: [
    './annotation-text-comment-list.component.css',
  ],
})
export class AnnotationTextCommentListComponent implements AfterViewInit {
  @Input() comments?: Comment[] | null;
  @Output() create = new EventEmitter<string>();
  @Output() update = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<number>();

  @ViewChildren('comment') textCommentComponents!: QueryList<AnnotationTextCommentComponent>;

  commentText = '';

  ngAfterViewInit() {
    this.comments?.sort((commentA, commentB) => {
      return commentA.createdAt > commentB.createdAt ? 1 : -1;
    });
  }

  reset() {
    this.textCommentComponents.forEach((textCommentComponent: AnnotationTextCommentComponent) => {
      textCommentComponent.onCancel();
    });
  }

  onTextCommentDelete(commentId: number) {
    this.delete.emit(commentId);
  }

  onTextCommentUpdate(comment: Comment) {
    this.update.emit(comment);
  }

  onTextCommentCreate() {
    this.create.emit(this.commentText);
    this.commentText = '';
  }
}
